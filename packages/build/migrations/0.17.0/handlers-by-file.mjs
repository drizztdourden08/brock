/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { HANDLERS_NAME } from '../../src/handlers/handlers.constants.mjs';
import { scanHandlers } from '../../src/handlers/scan-handlers.mjs';
import { handlersOption, importedFrom, listedIn, namesIn, sameGroups } from '../../src/upgrade/handlers/hand-list.mjs';

const MAIN = 'electron/main.ts';
const INDEX = 'electron/handlers/index.ts';
const FROM = '../.brock/handlers.main';
const IMPORT = `import { ${HANDLERS_NAME} } from '${FROM}';`;
const CONVENTION = `brock sync now writes .brock/handlers.main.ts from electron/handlers/<subject>-handlers.ts, each exporting <subject>Handlers (engine-handlers.ts exports engineHandlers). Pass handlers: ${HANDLERS_NAME} from '${FROM}' to bootstrapApp`;

const lineOf = (source, index) => source.slice(0, index).split('\n').length;

const withImport = (source, drop) => {
  const kept = source.split('\n').filter((line) => !drop.some((name) => new RegExp(`^import\\s*\\{\\s*${name}\\s*\\}\\s*from\\s*'[^']+';`).test(line)));
  const lastImport = kept.reduce((at, line, index) => (line.startsWith('import ') ? index : at), -1);
  kept.splice(lastImport + 1, 0, IMPORT);
  return kept.join('\n');
};

const replaced = (source, option) => `${source.slice(0, option.start)}handlers: ${HANDLERS_NAME}${source.slice(option.end)}`;

const indexMatches = (rootDir, list, scanned) => {
  const file = join(rootDir, INDEX);
  if (!existsSync(file)) return false;
  const source = readFileSync(file, 'utf8');
  const listed = listedIn(source, list);
  const onlyList = new RegExp(`^export\\s*\\{\\s*${list}\\s*\\};?\\s*$`, 'm').test(source) && (source.match(/^export\b/gm) ?? []).length === 1;
  return listed !== null && onlyList && sameGroups(listed, scanned, source, './');
};

const rewrite = (rootDir, source, option, scanned) => {
  if (option.value?.startsWith('[')) {
    const listed = namesIn(option.value);
    return sameGroups(listed, scanned, source, './handlers/') ? { source: withImport(replaced(source, option), listed), removed: [] } : null;
  }
  const list = option.value ?? 'handlers';
  const fromIndex = ['./handlers', './handlers/index'].includes(importedFrom(source, list) ?? '');
  return fromIndex && indexMatches(rootDir, list, scanned) ? { source: withImport(replaced(source, option), [list]), removed: [INDEX] } : null;
};

const added = (source) => {
  const anchor = /\bbootTasks:\s*[\w$]+/.exec(source);
  if (!anchor) return null;
  const lineStart = source.lastIndexOf('\n', anchor.index) + 1;
  const indent = source.slice(lineStart, anchor.index);
  const end = anchor.index + anchor[0].length;
  const insert = indent.trim() === '' ? `,\n${indent}handlers: ${HANDLERS_NAME}` : `, handlers: ${HANDLERS_NAME}`;
  return withImport(`${source.slice(0, end)}${insert}${source.slice(end)}`, []);
};

const todo = (source, at, message) => ({ todos: [{ file: MAIN, line: lineOf(source, at), message }] });

const namesOf = (scanned) => scanned.map(({ name }) => name).join(', ');

const planFor = (rootDir, source) => {
  const scanned = scanHandlers(rootDir);
  const option = handlersOption(source);
  if (!option && scanned.length > 0) return todo(source, 0, `${CONVENTION}. electron/handlers holds ${namesOf(scanned)}, but bootstrapApp gets no handlers; check they should all register, then pass the generated list.`);
  const result = option ? rewrite(rootDir, source, option, scanned) : { source: added(source), removed: [] };
  return result?.source ? result : todo(source, option?.start ?? 0, `${CONVENTION} in place of the hand list, once the two agree: the generated list is [${namesOf(scanned)}].`);
};

const workspace = ({ rootDir }) => {
  const file = join(rootDir, MAIN);
  const source = existsSync(file) ? readFileSync(file, 'utf8') : null;
  if (source === null || source.includes(`'${FROM}'`)) return {};
  const plan = planFor(rootDir, source);
  if (plan.todos) return plan;
  writeFileSync(file, plan.source, 'utf8');
  for (const path of plan.removed) rmSync(join(rootDir, path));
  return { touched: [MAIN, ...plan.removed.map((path) => `${path} (removed)`)] };
};

const migration = Object.freeze({
  id: 'handlers-by-file',
  summary: 'Handler groups by file name: brock sync writes .brock/handlers.main.ts from electron/handlers/<subject>-handlers.ts. electron/main.ts passes handlers: mainHandlers; a hand list that names exactly those groups is dropped (electron/handlers/index.ts is removed when it held only that list), and any other list becomes a to-do.',
  workspace,
});

export { migration };
