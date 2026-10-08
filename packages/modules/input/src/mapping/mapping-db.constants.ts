/* @layer core @kind constants */
const INPUT_DIR = 'input';
const DB_FILE = 'gamecontrollerdb.txt';
const USER_DB_PATH = `${INPUT_DIR}/${DB_FILE}`;
const BUNDLED_DB_SPECIFIER = '@drizztdourden08/brock-input/gamecontrollerdb.txt';
const GUID_PATTERN = /^[0-9a-fA-F]{24,}$/;
const XINPUT_PSEUDO_GUID = 'xinput';

export { INPUT_DIR, DB_FILE, USER_DB_PATH, BUNDLED_DB_SPECIFIER, GUID_PATTERN, XINPUT_PSEUDO_GUID };
