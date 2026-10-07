/* @layer tooling-scripts @kind constants */
const TITLE_BAR_DIR = 'src/title-bar';
const TITLE_BAR_OUTPUT = '.brock/title-bar.ts';
const ITEM_SUFFIX = '.action.ts';
const ITEM_ID = /^[a-z][a-z0-9-]*$/;
const CONSTANTS_FILE = /^[a-z][a-z0-9-]*(?:\.action)?\.constants\.ts$/;
const RESERVED_IDS = ['search', 'report-bug', 'brock-jobs'];
const FILE_HINT = "a title bar item is src/title-bar/<id>.action.ts, default-exporting defineTitleBarItem({ kind, label, icon, ... }) or a hook that returns one; an item's constants go beside it in <id>.action.constants.ts (or <name>.constants.ts when several items share them)";
const FOLDER_HINT = 'src/title-bar holds title bar item files and their constants files only, never folders; shared logic goes in src/hooks or src/stores';

export { CONSTANTS_FILE, FILE_HINT, FOLDER_HINT, ITEM_ID, ITEM_SUFFIX, RESERVED_IDS, TITLE_BAR_DIR, TITLE_BAR_OUTPUT };
