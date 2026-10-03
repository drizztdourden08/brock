/* @layer tooling-scripts @kind logic */
const BROCK_REACT = '@drizztdourden08/brock-react';
const BROCK_INPUT = '@drizztdourden08/brock-input/renderer';

const MOVED = Object.freeze({
  AboutPanel: BROCK_REACT,
  AboutPanelProps: BROCK_REACT,
  AboutPanelRow: BROCK_REACT,
  AboutPanelHeading: BROCK_REACT,
  ReleaseNotesPanel: BROCK_REACT,
  ReleaseNotesPanelProps: BROCK_REACT,
  CalibrationPanel: BROCK_INPUT,
  CalibrationPanelProps: BROCK_INPUT,
  CalibrationPanelAction: BROCK_INPUT,
});

const PICKER = /^ProfilePicker(?:Item|Props)?$/;

const PICKER_TODO = 'ProfilePicker leaves Tessera. Use ProfilesPanel from @drizztdourden08/brock-react: profiles, selectedId, onSelect and onDelete stay; the create slot and onNew become onCreate, a promise the panel awaits while it draws InlineCreateForm itself, and createOpen keeps the form open while no profile exists; onRename adds rename in the row. The built-in Profiles screen already uses it.';

const TESSERA_IMPORT = /import\s+(type\s+)?\{([^}]*)\}\s*from\s*(['"])(@drizztdourden08\/tessera(?:\/[\w-]+)?)\3[ \t]*;?/g;

const lineAt = (source, index) => source.slice(0, index).split('\n').length;

const specifiersOf = (list) => list.split(',').map((part) => part.trim()).filter(Boolean);

const nameOf = (specifier) => specifier.replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();

const importText = ({ typeOnly, specifiers, from, quote = "'" }) => `import ${typeOnly ? 'type ' : ''}{ ${specifiers.join(', ')} } from ${quote}${from}${quote};`;

const escaped = (text) => text.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');

const splitImport = (match) => {
  const [statement, typeOnly, list, quote, from] = match;
  const keep = [];
  const moved = new Map();
  for (const specifier of specifiersOf(list)) {
    const target = MOVED[nameOf(specifier)];
    if (target) moved.set(target, [...(moved.get(target) ?? []), specifier]);
    else keep.push(specifier);
  }
  const rest = keep.length > 0 ? importText({ typeOnly, specifiers: keep, from, quote }) : '';
  return { statement, typeOnly: Boolean(typeOnly), quote, rest, moved };
};

const mergeInto = (source, { from, typeOnly, quote, specifiers }) => {
  const existing = source.match(new RegExp(`import\\s+${typeOnly ? 'type\\s+' : ''}\\{([^}]*)\\}\\s*from\\s*['"]${escaped(from)}['"][ \\t]*;?`));
  if (!existing) return null;
  const have = new Set(specifiersOf(existing[1]).map(nameOf));
  const added = specifiers.filter((specifier) => !have.has(nameOf(specifier)));
  return source.replace(existing[0], importText({ typeOnly, specifiers: [...specifiersOf(existing[1]), ...added], from, quote }));
};

const dropStatement = (source, statement) => {
  const at = source.indexOf(statement);
  const end = at + statement.length;
  const newline = source.slice(end).match(/^\r?\n/)?.[0].length ?? 0;
  return source.slice(0, at) + source.slice(end + newline);
};

const rewriteImport = (source, split) => {
  let next = source;
  const fresh = [];
  for (const [from, specifiers] of split.moved) {
    const merged = mergeInto(next, { from, typeOnly: split.typeOnly, quote: split.quote, specifiers });
    if (merged === null) fresh.push(importText({ typeOnly: split.typeOnly, specifiers, from, quote: split.quote }));
    else next = merged;
  }
  const replacement = [split.rest, ...fresh].filter(Boolean).join('\n');
  return replacement === '' ? dropStatement(next, split.statement) : next.replace(split.statement, replacement);
};

const pickerTodos = (source) =>
  [...source.matchAll(TESSERA_IMPORT)]
    .filter((match) => specifiersOf(match[2]).some((specifier) => PICKER.test(nameOf(specifier))))
    .map((match) => ({ line: lineAt(source, match.index), message: PICKER_TODO }));

const apply = ({ source }) => {
  const todos = pickerTodos(source);
  const splits = [...source.matchAll(TESSERA_IMPORT)].map(splitImport).filter((split) => split.moved.size > 0);
  return { source: splits.reduce(rewriteImport, source), todos };
};

const migration = Object.freeze({
  id: 'brock-compounds',
  summary: 'AboutPanel, ReleaseNotesPanel and CalibrationPanel are Brock compounds now: their imports move from @drizztdourden08/tessera to @drizztdourden08/brock-react (AboutPanel, ReleaseNotesPanel) and @drizztdourden08/brock-input/renderer (CalibrationPanel, which needs the input module). ProfilePicker becomes a to-do pointing to ProfilesPanel in brock-react.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
