/* @layer tooling-scripts @kind constants */
const TOURS_DIR = 'src/tours';
const TOURS_OUTPUT = '.brock/tours.ts';
const TOUR_SUFFIX = '.tour.ts';
const TOUR_ID = /^[a-z][a-z0-9-]*$/;
const CONSTANTS_FILE = /^[a-z][a-z0-9-]*(?:\.tour)?\.constants\.ts$/;
const LITERAL_ID = /defineTour\(\s*\{\s*id:\s*'([^']*)'/;
const FILE_HINT = "a tour is src/tours/<id>.tour.ts, default-exporting defineTour({ id, title, steps, trigger? }); a tour's constants go beside it in <id>.tour.constants.ts (or <name>.constants.ts when several tours share them), and shared step helpers in src/hooks or src/stores";
const FOLDER_HINT = 'src/tours holds tour files and their constants files only, never folders';

export { CONSTANTS_FILE, FILE_HINT, FOLDER_HINT, LITERAL_ID, TOUR_ID, TOUR_SUFFIX, TOURS_DIR, TOURS_OUTPUT };
