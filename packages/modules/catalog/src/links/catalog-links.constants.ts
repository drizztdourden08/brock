/* @layer core @kind constants */
const LINK_HOST = 'install';
const MAX_LINK_CHARS = 256;
const MAX_VERSION = 1_000_000;
const ITEM_ID = /^[A-Za-z0-9_-]{1,128}$/;
const RESERVED_ID = /^__.*__$/;
const VERSION_QUERY = /^v=([1-9][0-9]{0,6})$/;
const LINK_SCHEME = /^[a-z][a-z0-9+.-]*$/;

export { LINK_HOST, MAX_LINK_CHARS, MAX_VERSION, ITEM_ID, RESERVED_ID, VERSION_QUERY, LINK_SCHEME };
