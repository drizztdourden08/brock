/* @layer core @kind constants */
const APP_ERROR_MARKER = '␞brock-app-error:';
const APP_ERROR_CODE = /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,63}$/;
const APP_ERROR_DATA_MAX = 8192;
const APP_ERROR_MESSAGE_MAX = 2000;
const APP_ERROR_DEPTH_MAX = 12;
const ELECTRON_INVOKE_PREFIX = /^Error invoking remote method '[^']*': (?:[A-Za-z]*Error: )?/;

export { APP_ERROR_MARKER, APP_ERROR_CODE, APP_ERROR_DATA_MAX, APP_ERROR_MESSAGE_MAX, APP_ERROR_DEPTH_MAX, ELECTRON_INVOKE_PREFIX };
