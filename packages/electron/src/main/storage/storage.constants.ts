/* @layer electron-main @kind constants */
const STAT_LANES = 32;

const DAY_MS = 86_400_000;

const MANIFEST_FILE = 'brock-export.json';

const JSON_TEMP_SUFFIX = '.tmp';

const RENAME_BUSY_CODES = ['EPERM', 'EBUSY', 'EACCES'];

const RENAME_RETRIES = 5;

const RENAME_RETRY_MS = 30;

const STAMP_SLACK_MS = 2000;

const ZIP_FILTERS = [{ name: 'Zip archive', extensions: ['zip'] }];

export { DAY_MS, JSON_TEMP_SUFFIX, MANIFEST_FILE, RENAME_BUSY_CODES, RENAME_RETRIES, RENAME_RETRY_MS, STAMP_SLACK_MS, STAT_LANES, ZIP_FILTERS };
