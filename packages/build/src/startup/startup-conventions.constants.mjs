/* @layer tooling-scripts @kind constants */
const STARTUP_DIR = 'src/startup';
const STARTUP_OUTPUT = '.brock/startup.ts';
const PROMPT_SUFFIX = '.prompt.ts';
const PROMPT_ID = /^[a-z][a-z0-9-]*$/;
const CONSTANTS_FILE = /^[a-z][a-z0-9-]*(?:\.prompt)?\.constants\.ts$/;
const FILE_HINT = "a start-up prompt is src/startup/<id>.prompt.ts, default-exporting defineStartupPrompt({ order?, run(ctx) }); its constants go beside it in <id>.prompt.constants.ts (or <name>.constants.ts when several prompts share them), and shared helpers in src/hooks or src/stores";
const PROMPT_SHELL = { order: 'literal' };
const LAZY_PROMPT = 'lazyStartupPrompt';
const FOLDER_HINT = 'src/startup holds prompt files and their constants files only, never folders';

export { CONSTANTS_FILE, FILE_HINT, FOLDER_HINT, LAZY_PROMPT, PROMPT_ID, PROMPT_SHELL, PROMPT_SUFFIX, STARTUP_DIR, STARTUP_OUTPUT };
