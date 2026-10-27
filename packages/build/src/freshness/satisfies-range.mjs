/* @layer tooling-scripts @kind logic */

const VERSION = /^v?(\d+)(?:\.(\d+|x|\*))?(?:\.(\d+|x|\*))?/i;
const COMPARATOR = /^(>=|<=|>|<|=|\^|~)?(.+)$/;

const COMPARES = {
  '>=': (order) => order >= 0,
  '>': (order) => order > 0,
  '<=': (order) => order <= 0,
  '<': (order) => order < 0,
  '=': (order) => order === 0,
};

const number = (value) => (value === undefined || /^[x*]$/i.test(value) ? 0 : Number(value));

const parts = (text) => {
  const match = VERSION.exec(text.trim());
  return match ? [number(match[1]), number(match[2]), number(match[3])] : null;
};

const compare = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

const caretHigh = (low) => {
  if (low[0] > 0) return [low[0] + 1, 0, 0];
  if (low[1] > 0) return [0, low[1] + 1, 0];
  return [0, 0, low[2] + 1];
};

const inSpan = (version, operator, text) => {
  const low = parts(text);
  if (!low) return null;
  const high = operator === '~' ? [low[0], low[1] + 1, 0] : caretHigh(low);
  return compare(version, low) >= 0 && compare(version, high) < 0;
};

const matches = (version, comparator) => {
  const [, operator = '=', text] = COMPARATOR.exec(comparator) ?? [];
  if (operator === '^' || operator === '~') return inSpan(version, operator, text);
  const bound = parts(text ?? '');
  return bound ? COMPARES[operator](compare(version, bound)) : null;
};

/**
 * @param {string} version
 * @param {string} range an unreadable range counts as a match
 * @returns {boolean}
 */
const satisfiesRange = (version, range) => {
  const parsed = parts(version);
  if (!parsed) return true;
  const sets = range.split('||').map((set) => set.trim().split(/\s+/).filter(Boolean));
  const verdicts = sets.map((set) => set.map((comparator) => matches(parsed, comparator)));
  if (verdicts.some((set) => set.includes(null))) return true;
  return verdicts.some((set) => set.every(Boolean));
};

export { satisfiesRange };
