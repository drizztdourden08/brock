/* @layer tooling-scripts @kind logic */
import { withBrockAppProp } from '../../src/upgrade/codemods/brock-app-prop.mjs';
import { findJsxProps, patternTodos } from '../../src/upgrade/index.mjs';

const CONVENTION = 'Widgets now live in src/widgets/<id>.widget.tsx: the default export is the component, `meta` holds label, icon, popOut, devOnly, defaultVisibility (\'context-only\'), defaultSide and the default sizes. brock sync lists them in .brock/widgets.ts, which src/main.tsx hands to BrockApp as widgets.';

const MAIN = /(^|\/)src\/main\.tsx$/;
const WIDGET_FILE = /(^|\/)src\/widgets\/[^/]+\.widget\.tsx$/;
const GENERATED = 'appWidgets';

const idNote = (source, index) => {
  const id = /\bid:\s*['"]([a-z][a-z0-9-]*)['"]/.exec(source.slice(index, index + 400))?.[1];
  return id ? `src/widgets/${id}.widget.tsx` : 'src/widgets/<id>.widget.tsx';
};

const defineTodos = (source) => [...source.matchAll(/\bdefineWidget\(/g)].map((match) => ({
  line: source.slice(0, match.index).split('\n').length,
  message: `${CONVENTION} This widget is defined by hand: move it to ${idNote(source, match.index)} and drop the definition. A widget a module ships stays in its module.`,
}));

const RULES = [
  { pattern: /\bregisterWidgets\(/g, message: `${CONVENTION} registerWidgets hands Brock widgets defined by hand: once each one is a file in src/widgets, remove this call.` },
];

const hostTodos = (source) => findJsxProps(source, 'WidgetHost', ['widgets']).map((prop) => ({
  line: prop.line,
  message: `${CONVENTION} BrockApp mounts the widget host itself; move these widgets to src/widgets and drop this WidgetHost.`,
}));

const appPropTodos = (source) => findJsxProps(source, 'BrockApp', ['widgets'])
  .filter((prop) => source.slice(prop.start, prop.end).replace(/\s/g, '') !== `widgets={${GENERATED}}`)
  .map((prop) => ({ line: prop.line, message: `${CONVENTION} These widgets are passed by hand: move each one to src/widgets, then pass widgets={appWidgets} from '../.brock/widgets'.` }));

const withWidgetsProp = (source) => withBrockAppProp(source, { prop: 'widgets', name: GENERATED, from: '../.brock/widgets' });

const apply = ({ path, source }) => {
  if (WIDGET_FILE.test(path)) return { source, todos: [] };
  const next = MAIN.test(path) ? withWidgetsProp(source) : source;
  return { source: next, todos: [...patternTodos(next, RULES), ...defineTodos(next), ...hostTodos(next), ...appPropTodos(next)] };
};

const migration = Object.freeze({
  id: 'widget-files',
  summary: 'Widgets by convention: src/widgets/<id>.widget.tsx files are listed by brock sync in .brock/widgets.ts. src/main.tsx gets widgets={appWidgets} on BrockApp and the import beside the other .brock imports. Widgets defined by hand (defineWidget, registerWidgets, a widgets prop) become to-dos naming their new file; they are not moved, because a hand-written definition can close over app state a file of its own would lose.',
  files: /(^|\/)src\/.+\.tsx?$/,
  apply,
});

export { migration };
