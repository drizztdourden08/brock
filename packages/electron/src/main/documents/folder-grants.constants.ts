/* @layer electron-main @kind constants */
const WINDOWS_DEVICE_NAME = /^(con|prn|aux|nul|conin\$|conout\$|(com|lpt)[0-9\u00b9\u00b2\u00b3]) *(\..*)?$/i;

const WINDOWS_RAW_PREFIX = /^[\\/]{2}[?.][\\/]/;

const WINDOWS_TRAILING = /[. \u00a0\u2024\u3002\ufe52\uff0e]$/;

const NETWORK_PATH = /^[\\/]{2}/;

export { NETWORK_PATH, WINDOWS_DEVICE_NAME, WINDOWS_RAW_PREFIX, WINDOWS_TRAILING };
