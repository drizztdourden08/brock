/* @layer tooling-scripts @kind logic */
import { checkoutRoot } from './checkout-root.mjs';
import { parseSlot } from './parse-slot.mjs';
import { PORT_SLOT_ENV } from './ports.constants.mjs';
import { slotFileOf } from './slot-file-of.mjs';

/**
 * @param {string} dir the app folder, or any folder in the checkout
 * @param {Record<string, string | undefined>} [env]
 * @returns {number} BROCK_PORT_SLOT, else the slot file, else 0
 */
const portSlotOf = (dir, env = process.env) => {
  const fromEnv = parseSlot(env[PORT_SLOT_ENV]);
  if (fromEnv !== null) return fromEnv;
  const root = checkoutRoot(dir);
  return root ? (slotFileOf(root) ?? 0) : 0;
};

export { portSlotOf };
