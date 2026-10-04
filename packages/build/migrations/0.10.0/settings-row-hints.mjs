/* @layer tooling-scripts @kind logic */
import { loadTypescript, tsSource } from '../../src/upgrade/index.mjs';

const FIELDS = 'Brock 0.10.0 and Tessera 0.10.0 give every settings row a hint, the line shown in place of the description while the control is pointed at, and a description, the line under the title at rest; the typecheck fails without them.';

const NO_TYPESCRIPT = `${FIELDS} TypeScript is not installed, so the rows here were not read: give each row hint and description, or noDescription: true.`;

const ROW_LISTS = new Set(['items', 'rows']);

const TEMPLATE_HINTS = Object.freeze({
  'windowMode|Window mode': 'Pick how the window sits on the screen. It changes right away.',
  'startFullscreen|Start fullscreen': 'On, the app opens fullscreen the next time it starts. The window you have now stays as it is.',
  'enableAudio|Audio': 'Off mutes every sound the app plays, whatever the volume.',
  'masterVolume|Master volume': 'Drag to scale every sound at once. 100% plays them as made.',
  'developerToolsEnabled|Developer tools': 'On, the menu shows the developer entries and the shortcut opens the browser developer tools.',
  'allowDebugLogging|Debug logging': 'On, the session log keeps the detailed lines that help when you report a bug. The log grows faster.',
});

const nameOf = (ts, node) => (node.name && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) ? node.name.text : null);

const listNameOf = (ts, list) => {
  const holder = list.parent;
  if (ts.isPropertyAssignment(holder)) return nameOf(ts, holder);
  if (ts.isJsxExpression(holder) && ts.isJsxAttribute(holder.parent)) return holder.parent.name.getText();
  return null;
};

const fieldsOf = (ts, object) => new Map(object.properties.filter((property) => !ts.isSpreadAssignment(property)).map((property) => [nameOf(ts, property), property]));

const isRow = (ts, object, fields) => {
  const brock = fields.has('key') && fields.has('label');
  const tessera = fields.has('id') && (fields.has('input') || fields.has('content'));
  return (brock || tessera) && !object.properties.some((property) => ts.isSpreadAssignment(property));
};

const rowsOf = (ts, file) => tsSource.nodesOf(ts, file, (node) =>
  ts.isObjectLiteralExpression(node) && ts.isArrayLiteralExpression(node.parent) && ROW_LISTS.has(listNameOf(ts, node.parent) ?? ''));

const labelOf = (ts, fields) => {
  const label = fields.get('label') ?? fields.get('title') ?? fields.get('key') ?? fields.get('id');
  return label && ts.isPropertyAssignment(label) && ts.isStringLiteralLike(label.initializer) ? `"${label.initializer.text}"` : 'this row';
};

const missingOf = (fields) => [
  ...(fields.has('hint') ? [] : ['hint']),
  ...(fields.has('description') || fields.has('noDescription') ? [] : ['description (or noDescription: true)']),
];

const textOf = (ts, fields, name) => {
  const field = fields.get(name);
  return field && ts.isPropertyAssignment(field) && ts.isStringLiteralLike(field.initializer) ? field.initializer.text : null;
};

const templateHintOf = (ts, fields) => (fields.has('hint') ? null : TEMPLATE_HINTS[`${textOf(ts, fields, 'key')}|${textOf(ts, fields, 'label')}`] ?? null);

const hintEdit = (file, object, after, hint) => {
  const source = file.text;
  const lineStart = source.lastIndexOf('\n', after.getStart(file)) + 1;
  const indent = /^[ \t]*/.exec(source.slice(lineStart))?.[0] ?? '';
  const multiline = source.slice(object.getStart(file), after.getStart(file)).includes('\n');
  return { start: after.end, end: after.end, text: `${multiline ? `,\n${indent}` : ', '}hint: '${hint.replace(/'/g, "\\'")}'` };
};

const rowOf = (ts, file, object) => {
  const fields = fieldsOf(ts, object);
  if (!isRow(ts, object, fields)) return { edits: [], todos: [] };
  const hint = templateHintOf(ts, fields);
  const edits = hint ? [hintEdit(file, object, fields.get('description') ?? fields.get('label'), hint)] : [];
  const missing = missingOf(hint ? new Map([...fields, ['hint', null]]) : fields);
  if (missing.length === 0) return { edits, todos: [] };
  return { edits, todos: [{ line: tsSource.lineOf(file, object), message: `${FIELDS} The settings row ${labelOf(ts, fields)} has no ${missing.join(' and no ')}. Add ${missing.join(' and ')}.` }] };
};

const apply = ({ path, source }) => {
  const ts = loadTypescript(process.cwd());
  if (!ts) return { source, todos: /\.settings\.ts$/.test(path) ? [{ line: 1, message: NO_TYPESCRIPT }] : [] };
  const file = tsSource.parse(ts, path, source);
  const rows = rowsOf(ts, file).map((object) => rowOf(ts, file, object));
  return { source: tsSource.applyEdits(source, rows.flatMap((row) => row.edits)), todos: rows.flatMap((row) => row.todos) };
};

const migration = Object.freeze({
  id: 'settings-row-hints',
  summary: 'Every settings row now needs a hint and a description, or noDescription: true. A row create-brock scaffolded gets the template hint; every other row without them, in a .settings.ts page, a settings tab or a Tessera SettingsSection, becomes a to-do naming the missing fields.',
  files: /(?:^|\/)src\/.+\.tsx?$/,
  apply,
});

export { migration };
