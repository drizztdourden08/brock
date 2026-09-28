/* @layer core @kind logic */
const sha256Hex = async (bytes: Uint8Array): Promise<string> => {
  const copy = new Uint8Array(bytes);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', copy);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
};

export { sha256Hex };
