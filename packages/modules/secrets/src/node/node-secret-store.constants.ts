/* @layer core @kind constants */
const NODE_SECRETS_DIR = 'secrets';
const NODE_SECRETS_FILE = `${NODE_SECRETS_DIR}/secrets.json`;
const ENV_PREFIX = 'BROCK_SECRET_';
const FILE_MODE = 0o600;
const DIR_MODE = 0o700;

export { NODE_SECRETS_FILE, ENV_PREFIX, FILE_MODE, DIR_MODE };
