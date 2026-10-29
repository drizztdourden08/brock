/* @layer tooling-scripts @kind constants */
const SHARED_VERSION = 1;
const SHARED_TARGETS = ['main', 'preload'];
const RECORD_FILE = 'record.json';
const MAX_VARIANTS = 8;
const KEY_LENGTH = 16;
const UNSAFE_SEGMENT = /[^\w.+@-]/g;
const TEXT_OUTPUT = /\.(?:[cm]?js|json)$/;
const ROOT_TOKENS = { url: '@@brock-root-url@@', posix: '@@brock-root-posix@@', native: '@@brock-root-native@@' };

export { KEY_LENGTH, MAX_VARIANTS, RECORD_FILE, ROOT_TOKENS, SHARED_TARGETS, SHARED_VERSION, TEXT_OUTPUT, UNSAFE_SEGMENT };
