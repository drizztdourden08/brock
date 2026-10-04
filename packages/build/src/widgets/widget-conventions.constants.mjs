/* @layer tooling-scripts @kind constants */
const WIDGETS_DIR = 'src/widgets';
const WIDGETS_OUTPUT = '.brock/widgets.ts';
const WIDGET_SUFFIX = '.widget.tsx';
const WIDGET_ID = /^[a-z][a-z0-9-]*$/;
const DEFAULT_EXPORT = /export\s+default\b|export\s*\{[^}]*\bdefault\b[^}]*\}/;
const BUILT_IN_WIDGET_IDS = ['logs', 'performance'];

const META_KEYS = [
  'label', 'icon', 'popOut', 'devOnly', 'taskbar', 'settings',
  'defaultVisibility', 'defaultSide', 'defaultDockedSize', 'defaultFloatingSize',
];

const FILE_HINT = 'a widget is src/widgets/<id>.widget.tsx (default export: the component, named export: meta); helpers and parts go in src/views, src/stores or the design package';
const FOLDER_HINT = 'src/widgets holds widget files only, never folders; a widget with parts imports them from src/views/<Name>/';

export { BUILT_IN_WIDGET_IDS, DEFAULT_EXPORT, FILE_HINT, FOLDER_HINT, META_KEYS, WIDGET_ID, WIDGET_SUFFIX, WIDGETS_DIR, WIDGETS_OUTPUT };
