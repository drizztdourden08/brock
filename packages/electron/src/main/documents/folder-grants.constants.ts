/* @layer electron-main @kind constants */
const WINDOWS_DEVICE_NAME = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;

const WINDOWS_RAW_PREFIX = /^[\\/]{2}[?.][\\/]/;

export { WINDOWS_DEVICE_NAME, WINDOWS_RAW_PREFIX };
