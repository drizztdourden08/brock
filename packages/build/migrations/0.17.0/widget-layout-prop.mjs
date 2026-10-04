/* @layer tooling-scripts @kind logic */
import { findJsxProps } from '../../src/upgrade/index.mjs';

const MAIN = /(^|\/)src\/main\.tsx$/;
const WIDGETS_IMPORT = /import\s*\{([^}]*)\}\s*from\s*'\.\.\/\.brock\/widgets';/;
const LAYOUT = 'appWidgetLayout';
const PROP = `widgetLayout={${LAYOUT}}`;

const withImport = (source) => {
  const match = WIDGETS_IMPORT.exec(source);
  if (!match) return source;
  const names = match[1].split(',').map((name) => name.trim()).filter(Boolean);
  if (names.includes(LAYOUT)) return source;
  const line = `import { ${[LAYOUT, ...names].join(', ')} } from '../.brock/widgets';`;
  return `${source.slice(0, match.index)}${line}${source.slice(match.index + match[0].length)}`;
};

const withProp = (source) => {
  if (findJsxProps(source, 'BrockApp', ['widgetLayout']).length > 0) return source;
  const [widgets] = findJsxProps(source, 'BrockApp', ['widgets']);
  if (!widgets) return source;
  const lineStart = source.lastIndexOf('\n', widgets.start) + 1;
  const indent = /^[ \t]*/.exec(source.slice(lineStart))?.[0] ?? '';
  const ownLine = source.slice(lineStart, widgets.start).trim() === '';
  const prop = ownLine ? `\n${indent}${PROP}` : ` ${PROP}`;
  return `${source.slice(0, widgets.end)}${prop}${source.slice(widgets.end)}`;
};

const apply = ({ path, source }) => {
  if (!MAIN.test(path) || !WIDGETS_IMPORT.test(source)) return { source, todos: [] };
  return { source: withImport(withProp(source)), todos: [] };
};

const migration = Object.freeze({
  id: 'widget-layout-prop',
  summary: 'Widget layout presets: .brock/widgets.ts also exports appWidgetLayout (the default export of src/widgets/layout.ts, or undefined). src/main.tsx imports it beside appWidgets and passes widgetLayout={appWidgetLayout} to BrockApp, so a new src/widgets/layout.ts takes effect with no hand wiring.',
  files: /(^|\/)src\/main\.tsx$/,
  apply,
});

export { migration };
