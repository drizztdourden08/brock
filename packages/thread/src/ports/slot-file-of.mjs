/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseSlot } from './parse-slot.mjs';
import { PORT_SLOT_FILE } from './ports.constants.mjs';

/**
 * @param {string} checkout a checkout root
 * @returns {number | null} the slot written there, or null
 */
const slotFileOf = (checkout) => {
  const file = join(checkout, PORT_SLOT_FILE);
  return existsSync(file) ? parseSlot(readFileSync(file, 'utf8')) : null;
};

export { slotFileOf };
