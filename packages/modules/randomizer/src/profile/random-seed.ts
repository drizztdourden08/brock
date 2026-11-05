/* @layer core @kind logic */
import { HEX_RADIX, HEX_WIDTH, SEED_BYTES } from './random-seed.constants';

const randomSeed = (): string => {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(SEED_BYTES));
  return Array.from(bytes, (byte) => byte.toString(HEX_RADIX).padStart(HEX_WIDTH, '0')).join('');
};

export { randomSeed };
