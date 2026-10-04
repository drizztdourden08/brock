/* @layer tooling-scripts @kind logic */
import { loadTypescript, tsSource } from '../../src/upgrade/index.mjs';

const CALLS = new Set(['defineScreen', 'defineHub']);

const ICON_TODO = (call) => `Brock 0.10.0 gives every screen an icon and a title: ${call} now needs icon, the glowing mark of the page header that a fullscreen screen draws under its window header. `
  + "Add icon, such as <Icon name=\"layers\" />. A screen whose content draws its own headers, like a hub, sets header: 'own'.";

const callName = (ts, node) => (ts.isIdentifier(node.expression) ? node.expression.text : null);

const lacksIcon = (ts, object) =>
  !object.properties.some((property) => ts.isSpreadAssignment(property) || (property.name && ts.isIdentifier(property.name) && property.name.text === 'icon'));

const todosOf = (ts, file) => tsSource.nodesOf(ts, file, (node) => ts.isCallExpression(node) && CALLS.has(callName(ts, node) ?? ''))
  .filter((call) => call.arguments[0] && ts.isObjectLiteralExpression(call.arguments[0]) && lacksIcon(ts, call.arguments[0]))
  .map((call) => ({ line: tsSource.lineOf(file, call), message: ICON_TODO(callName(ts, call)) }));

const apply = ({ path, source }) => {
  if (!/\bdefine(?:Screen|Hub)\s*\(/.test(source)) return { source, todos: [] };
  const ts = loadTypescript(process.cwd());
  if (!ts) return { source, todos: [{ line: 1, message: ICON_TODO('defineScreen or defineHub') }] };
  return { source, todos: todosOf(ts, tsSource.parse(ts, path, source)) };
};

const migration = Object.freeze({
  id: 'screen-icons',
  summary: 'Every screen needs an icon now, for the page header Brock draws under the window header: a defineScreen or defineHub call without one becomes a to-do.',
  files: /(?:^|\/)src\/.+\.tsx?$/,
  apply,
});

export { migration };
