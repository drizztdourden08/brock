/* @layer tooling-scripts @kind constants */
const WIDGETS_DIR = 'src/widgets';
const WIDGETS_OUTPUT = '.brock/widgets.ts';
const WIDGET_SUFFIX = '.widget.tsx';
const LAYOUT_FILE = 'layout.ts';
const WIDGET_ID = /^[a-z][a-z0-9-]*$/;
const CONSTANTS_FILE = /^[a-z][a-z0-9-]*(?:\.widget)?\.constants\.ts$/;
const DEFAULT_EXPORT = /export\s+default\b|export\s*\{[^}]*\bdefault\b[^}]*\}/;
const BUILT_IN_WIDGET_IDS = ['logs', 'performance'];

const META_KEYS = [
  'label', 'icon', 'order', 'popOut', 'devOnly', 'taskbar', 'settings', 'defaultOpen',
  'defaultVisibility', 'defaultSide', 'defaultDockedSize', 'defaultFloatingSize', 'padding', 'fill', 'context',
];

const FILE_HINT = 'a widget is src/widgets/<id>.widget.tsx (default export: the component, named export: meta), and src/widgets/layout.ts default-exports the defineLayoutPreset layout; the constants of a widget go beside it in <id>.widget.constants.ts (layout.constants.ts for the layout, <name>.constants.ts when several widgets share them), and helpers and parts in src/views, src/stores or the design package';
const FOLDER_HINT = 'src/widgets holds widget files and their constants files only, never folders; a widget with parts imports them from src/views/<Name>/';

export { BUILT_IN_WIDGET_IDS, CONSTANTS_FILE, DEFAULT_EXPORT, FILE_HINT, FOLDER_HINT, LAYOUT_FILE, META_KEYS, WIDGET_ID, WIDGET_SUFFIX, WIDGETS_DIR, WIDGETS_OUTPUT };
