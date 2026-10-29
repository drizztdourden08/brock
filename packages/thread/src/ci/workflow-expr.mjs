/* @layer tooling-scripts @kind logic */

const EXPRESSION = /\$\{\{\s*([\s\S]*?)\s*\}\}/g;
const STRING = /^'(.*)'$/;
const EVENTS = Object.freeze({ push: 'push', pr: 'pull_request', manual: 'workflow_dispatch', release: 'release' });
const UNRESOLVED = Symbol('unresolved');

/**
 * @param {string} trigger the run's --trigger
 * @returns {string} the github.event_name it stands for
 */
const eventNameOf = (trigger) => EVENTS[trigger] ?? trigger;

const tableOf = (root, scope) => {
  if (root === 'env') return scope.env;
  return root === 'matrix' ? scope.matrix : null;
};

const lookup = (path, scope) => {
  if (path.startsWith('secrets.')) return '';
  if (path === 'github.event_name') return scope.eventName;
  if (path === 'runner.os') return scope.runnerOs;
  const [root, ...rest] = path.split('.');
  const value = tableOf(root, scope)?.[rest.join('.')];
  return value === undefined ? UNRESOLVED : String(value);
};

const term = (raw, scope) => {
  const value = raw.trim();
  const quoted = STRING.exec(value);
  if (quoted) return quoted[1].replace(/''/g, "'");
  if (/^-?\d+(\.\d+)?$/.test(value) || /^(true|false)$/.test(value)) return value;
  if (value === 'null') return '';
  return /^[\w.-]+$/.test(value) ? lookup(value, scope) : UNRESOLVED;
};

const orChain = (expression, scope) => {
  const values = expression.split('||').map((part) => term(part, scope));
  if (values.includes(UNRESOLVED)) return UNRESOLVED;
  return values.find((value) => value !== '' && value !== 'false') ?? values.at(-1);
};

/**
 * @param {string} source text that may hold ${{ ... }}
 * @param {{ env: Record<string, string>, matrix: Record<string, unknown>, eventName: string, runnerOs: string }} scope
 * @returns {{ text: string, unresolved: string[] }} the text, and the expressions left as they were
 */
const expand = (source, scope) => {
  const unresolved = [];
  const replaced = source.replace(EXPRESSION, (whole, expression) => {
    const value = orChain(expression, scope);
    if (value === UNRESOLVED) {
      unresolved.push(whole);
      return whole;
    }
    return value;
  });
  return { text: replaced, unresolved };
};

const comparison = (clause, scope) => {
  const match = /^(.+?)\s*(==|!=)\s*(.+)$/.exec(clause);
  if (!match) return true;
  const left = term(match[1], scope);
  const right = term(match[3], scope);
  if (left === UNRESOLVED || right === UNRESOLVED) return true;
  return (left === right) === (match[2] === '==');
};

const unwrap = (condition) => condition.trim().replace(/^\$\{\{\s*([\s\S]*?)\s*\}\}$/, '$1').trim();

/**
 * @param {string | null} condition an `if:` value
 * @param {{ env: Record<string, string>, matrix: Record<string, unknown>, eventName: string, runnerOs: string }} scope
 * @returns {{ run: boolean, afterFailure: boolean }} whether it holds, and whether it runs after a failure
 */
const judge = (condition, scope) => {
  if (!condition) return { run: true, afterFailure: false };
  const expression = unwrap(condition);
  const afterFailure = /\b(always|failure)\(\)/.test(expression);
  const run = expression.split('||').some((alternative) => alternative.split('&&').every((clause) => comparison(clause.replace(/^\(|\)$/g, ''), scope)));
  return { run, afterFailure };
};

export { eventNameOf, expand, judge };
