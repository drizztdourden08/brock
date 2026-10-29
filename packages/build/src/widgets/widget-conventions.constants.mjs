/* @layer tooling-scripts @kind constants */
const WIDGETS_DIR = 'src/widgets';
const WIDGETS_OUTPUT = '.brock/widgets.ts';
const KITS_OUTPUT = '.brock/widget-kits.ts';
const WIDGET_SUFFIX = '.widget.tsx';
const KIT_SUFFIX = '.kit.ts';
const OVERLAY_SUFFIX = '.overlay.tsx';
const LAYOUT_FILE = 'layout.ts';
const WIDGET_ID = /^[a-z][a-z0-9-]*$/;
const CONSTANTS_FILE = /^[a-z][a-z0-9-]*(?:\.(?:widget|kit|overlay))?\.constants\.ts$/;
const DEFAULT_EXPORT = /export\s+default\b|export\s*\{[^}]*\bdefault\b[^}]*\}/;
const BUILT_IN_WIDGET_IDS = ['logs', 'performance'];

const META_KEYS = [
  'label', 'icon', 'order', 'popOut', 'devOnly', 'taskbar', 'settings', 'tools', 'defaultOpen',
  'defaultVisibility', 'defaultSide', 'defaultDockedSize', 'dockWeight', 'defaultFloatingSize', 'padding', 'fill', 'chrome', 'context', 'contexts', 'when', 'empty', 'prefs', 'kit', 'menu',
];
const KIT_KEYS = ['label', 'icon', 'order', 'devOnly', 'requires', 'layout', 'menu', 'when'];
const MENU_PLACEMENT_KEYS = ['parent', 'group', 'order'];
const OVERLAY_KEYS = ['kit', 'label', 'order'];

const FILE_HINT = 'a widget is src/widgets/<id>.widget.tsx (default export: the component, named export: meta), a widget kit is src/widgets/<id>.kit.ts (default export: its WidgetKitMeta) with src/widgets/<id>.overlay.tsx for its overlays (default export: the component, named export: meta naming the kit), and src/widgets/layout.ts default-exports the defineLayoutPreset layout; the constants of a widget go beside it in <id>.widget.constants.ts (<id>.kit.constants.ts, <id>.overlay.constants.ts, layout.constants.ts for the layout, <name>.constants.ts when several widgets share them), and helpers and parts in src/views, src/stores or the design package';
const FOLDER_HINT = 'src/widgets holds widget, kit and overlay files and their constants files only, never folders; a widget with parts imports them from src/views/<Name>/';

export {
  BUILT_IN_WIDGET_IDS, CONSTANTS_FILE, DEFAULT_EXPORT, FILE_HINT, FOLDER_HINT, KIT_KEYS, KIT_SUFFIX, KITS_OUTPUT, LAYOUT_FILE, MENU_PLACEMENT_KEYS, META_KEYS, OVERLAY_KEYS, OVERLAY_SUFFIX,
  WIDGET_ID, WIDGET_SUFFIX, WIDGETS_DIR, WIDGETS_OUTPUT,
};
