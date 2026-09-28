/* @layer core @kind logic */
const contentHash = (bytes: Uint8Array): number => {
  let hash = 0x811c9dc5;
  for (const byte of bytes) hash = Math.imul(hash ^ byte, 0x01000193);
  return hash >>> 0;
};

export { contentHash };
