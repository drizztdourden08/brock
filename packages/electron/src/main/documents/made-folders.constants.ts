/* @layer electron-main @kind constants */
const TEMP_PREFIX_DEFAULT = 'brock-';

const TEMP_PREFIX_PATTERN = /^[A-Za-z0-9_-][A-Za-z0-9._-]{0,39}$/;

export { TEMP_PREFIX_DEFAULT, TEMP_PREFIX_PATTERN };
