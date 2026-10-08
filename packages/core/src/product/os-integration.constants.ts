/* @layer core @kind constants */
const URL_SCHEME = /^[a-z][a-z0-9+.-]{0,62}$/;
const FILE_EXTENSION = /^[a-z0-9][a-z0-9_-]{0,31}$/i;
const PROG_ID = /^[a-z][a-z0-9]*(?:\.[a-z0-9]+){1,2}$/i;
const RESERVED_SCHEMES = ['http', 'https', 'file', 'ftp', 'mailto', 'about', 'blob', 'data', 'javascript', 'chrome', 'devtools', 'ws', 'wss'];

export { URL_SCHEME, FILE_EXTENSION, PROG_ID, RESERVED_SCHEMES };
