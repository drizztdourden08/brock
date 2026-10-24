/* @layer tooling-scripts @kind constants */
const TOOLBARS_DIR = 'src/toolbars';
const TOOLBARS_OUTPUT = '.brock/toolbars.ts';
const TOOLBAR_SUFFIX = '.toolbar.tsx';
const TOOLBAR_ID = /^[a-z][a-z0-9-]*$/;
const CONSTANTS_FILE = /^[a-z][a-z0-9-]*(?:\.toolbar)?\.constants\.ts$/;
const LITERAL_ID = /defineToolbar\(\s*\{\s*id:\s*'([^']*)'/;
const FILE_HINT = 'a toolbar is src/toolbars/<id>.toolbar.tsx, default-exporting defineToolbar({ id, label, defaultSide, hiddenByDefault?, render(slot) }); its constants go beside it in <id>.toolbar.constants.ts (or <name>.constants.ts when several toolbars share them), and shared helpers in src/hooks or src/stores';
const FOLDER_HINT = 'src/toolbars holds toolbar files and their constants files only, never folders';

export { CONSTANTS_FILE, FILE_HINT, FOLDER_HINT, LITERAL_ID, TOOLBAR_ID, TOOLBAR_SUFFIX, TOOLBARS_DIR, TOOLBARS_OUTPUT };
