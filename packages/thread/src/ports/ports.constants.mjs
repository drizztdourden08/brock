/* @layer tooling-scripts @kind constants */
const PORT_SLOT_FILE = '.brock-port-slot';
const PORT_SLOT_ENV = 'BROCK_PORT_SLOT';
const PORT_BLOCK_SIZE = 10;
const PORT_OFFSETS = Object.freeze({ renderer: 0, firstTool: 1, lastTool: 9 });
const MAX_PORT_SLOT = 19;
const DERIVED_BASE_MIN = 20000;
const DERIVED_BASE_STEP = 200;
const DERIVED_BASE_COUNT = 140;
const MAX_PORT = 65535;
const MIN_PORT_BASE = 1024;

export {
  PORT_SLOT_FILE, PORT_SLOT_ENV, PORT_BLOCK_SIZE, PORT_OFFSETS, MAX_PORT_SLOT, DERIVED_BASE_MIN, DERIVED_BASE_STEP, DERIVED_BASE_COUNT,
  MAX_PORT, MIN_PORT_BASE,
};
