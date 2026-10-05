/* @layer electron-main @kind constants */
const STAT_LANES = 32;

const DAY_MS = 86_400_000;

const MANIFEST_FILE = 'brock-export.json';

const JSON_TEMP_SUFFIX = '.tmp';

const STAMP_SLACK_MS = 2000;

const ZIP_FILTERS = [{ name: 'Zip archive', extensions: ['zip'] }];

export { DAY_MS, JSON_TEMP_SUFFIX, MANIFEST_FILE, STAMP_SLACK_MS, STAT_LANES, ZIP_FILTERS };
