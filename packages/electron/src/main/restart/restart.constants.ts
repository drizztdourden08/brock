/* @layer electron-main @kind constants */
const HANDOFF_FILE = 'restart-handoff.json';
const HANDOFF_MAX_BYTES = 65_536;
const HANDOFF_ENVELOPE_BYTES = 128;
const HANDOFF_TTL_MS = 60_000;
const HANDOFF_TOO_LARGE = `the restart handoff is larger than ${HANDOFF_MAX_BYTES} bytes`;
const HANDOFF_NOT_JSON = 'the restart handoff must be JSON: plain objects, arrays, strings, finite numbers, booleans and null';

export { HANDOFF_ENVELOPE_BYTES, HANDOFF_FILE, HANDOFF_MAX_BYTES, HANDOFF_NOT_JSON, HANDOFF_TOO_LARGE, HANDOFF_TTL_MS };
