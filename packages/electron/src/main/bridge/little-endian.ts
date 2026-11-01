/* @layer electron-main @kind logic */

const littleEndian = (bytes: Uint8Array, at: number): number => (bytes[at] ?? 0) | ((bytes[at + 1] ?? 0) << 8);

export { littleEndian };
