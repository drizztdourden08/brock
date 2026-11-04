/* @layer core @kind constants */
const SCHEME = /^wss?:\/\//i;
const PORT_TAIL = /^(.*):(\d*)$/;
const PORT_DIGITS = /^\d+$/;
const MAX_PORT = 65535;

export { MAX_PORT, PORT_DIGITS, PORT_TAIL, SCHEME };
