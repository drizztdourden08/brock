/* @layer tooling-scripts @kind logic */
const ACTIONS_API = 'Brock 0.7.0 drops RendererModule.titleBar: the title bar takes actions now, and every action is in its hamburger menu too. '
  + 'Turn each slot into a WindowTitleBarAction from @drizztdourden08/tessera/composites, { id, label, icon, onSelect, bar?: \'button\' | \'status\' | \'menu\', status?, tone?, shortcut? }, '
  + 'and list it in titleBarActions; give a hook that returns the action (TitleBarActionHook) when it reads state, such as a status pill. '
  + 'An action whose id is the key of a menu entry replaces that entry in the hamburger.';

const MAPPED = Object.freeze({ UpdateBadge: { to: 'useUpdateAction', from: '@drizztdourden08/brock-updater/renderer' } });
const STANDARD = new Set(['SearchButton', 'BugReportButton']);
const BROCK_REACT = '@drizztdourden08/brock-react';

const SLOTS = /\btitleBar\s*:\s*\[([^\]]*)\]/g;
const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

const RULES = Object.freeze([
  { pattern: /\bTitleBarSlot\b/g, message: `TitleBarSlot is gone. ${ACTIONS_API}` },
  { pattern: /\bSTANDARD_TITLE_BAR_SLOTS\b/g, message: 'STANDARD_TITLE_BAR_SLOTS is now STANDARD_TITLE_BAR_ACTIONS: Search and Report a bug as WindowTitleBarAction objects, for the actions prop of WindowTitleBar.' },
  { pattern: /\.conditional\s*=\s*true\b/g, message: `A conditional title bar slot becomes an action with bar: 'status' and a status that is set only while it shows. ${ACTIONS_API}` },
]);

const lineAt = (source, index) => source.slice(0, index).split('\n').length;

const itemsOf = (list) => list.split(',').map((item) => item.trim()).filter(Boolean);

const isMechanical = (items) => items.every((item) => IDENTIFIER.test(item) && (Object.hasOwn(MAPPED, item) || STANDARD.has(item)));

const escaped = (text) => text.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');

const importOf = (source, from) => source.match(new RegExp(`import\\s+\\{([^}]*)\\}\\s*from\\s*(['"])${escaped(from)}\\2[ \\t]*;?(\\r?\\n)?`));

const usedOutsideImports = (source, name) =>
  new RegExp(`\\b${escaped(name)}\\b`).test(source.replace(/import\s+(?:type\s+)?\{[^}]*\}\s*from\s*['"][^'"]+['"][ \t]*;?/g, ''));

const rewriteImport = (source, from, rename) => {
  const found = importOf(source, from);
  if (!found) return source;
  const [statement, list, quote, eol = ''] = found;
  const specifiers = itemsOf(list).flatMap((specifier) => {
    const name = specifier.split(/\s+as\s+/)[0].trim();
    if (!Object.hasOwn(rename, name)) return [specifier];
    return rename[name] === null ? [] : [rename[name]];
  });
  const unique = [...new Set(specifiers)];
  const next = unique.length > 0 ? `import { ${unique.join(', ')} } from ${quote}${from}${quote};${eol}` : '';
  return source.replace(statement, next);
};

const dropProperty = (source, start, end) => {
  const lineStart = source.lastIndexOf('\n', start - 1) + 1;
  const newline = source.indexOf('\n', end);
  const lineEnd = newline === -1 ? source.length : newline + 1;
  if (/^\s*$/.test(source.slice(lineStart, start)) && /^\s*,?\s*$/.test(source.slice(end, lineEnd))) return source.slice(0, lineStart) + source.slice(lineEnd);
  if (/^\s*,/.test(source.slice(end))) return source.slice(0, start) + source.slice(end).replace(/^\s*,[ \t]*/, '');
  return source.slice(0, start).replace(/,\s*$/, '') + source.slice(end);
};

const rewriteSlots = (source, match) => {
  const items = itemsOf(match[1]);
  const mapped = items.filter((item) => Object.hasOwn(MAPPED, item)).map((item) => MAPPED[item].to);
  const start = match.index;
  const end = start + match[0].length;
  if (mapped.length === 0) return dropProperty(source, start, end);
  return `${source.slice(0, start)}titleBarActions: [${mapped.join(', ')}]${source.slice(end)}`;
};

const tidyImports = (source, replaced) => {
  let next = source;
  for (const name of replaced) {
    if (usedOutsideImports(next, name)) continue;
    const target = MAPPED[name];
    next = target ? rewriteImport(next, target.from, { [name]: target.to }) : rewriteImport(next, BROCK_REACT, { [name]: null });
  }
  return next;
};

const todosOf = (source) => [
  ...[...source.matchAll(SLOTS)].map((match) => ({ line: lineAt(source, match.index), message: ACTIONS_API })),
  ...RULES.flatMap((rule) => [...source.matchAll(rule.pattern)].map((match) => ({ line: lineAt(source, match.index), message: rule.message }))),
];

const apply = ({ source }) => {
  const mechanical = [...source.matchAll(SLOTS)].filter((match) => isMechanical(itemsOf(match[1])));
  if (mechanical.length === 0) return { source, todos: todosOf(source) };
  const rewritten = mechanical.reverse().reduce(rewriteSlots, source);
  const next = tidyImports(rewritten, new Set(mechanical.flatMap((match) => itemsOf(match[1]))));
  return { source: next, todos: todosOf(next) };
};

const migration = Object.freeze({
  id: 'title-bar-actions',
  summary: 'RendererModule.titleBar slots become titleBarActions: the updater badge becomes its useUpdateAction hook, the search and bug report buttons are standard actions and drop out, and any other slot is a to-do naming the WindowTitleBarAction API.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
