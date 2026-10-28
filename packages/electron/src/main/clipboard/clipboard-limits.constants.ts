/* @layer electron-main @kind constants */
const MIB = 1024 * 1024;

const CLIPBOARD_LIMITS = {
  entryBytes: 32 * MIB,
  textChars: 4 * MIB,
  entries: 8,
  side: 16384,
  pixels: 64 * MIB,
  watchers: 16,
  pollMs: 500,
  idChars: 64,
};

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const PNG_END = [0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82];

const PNG_HEADER_BYTES = 33;

export { CLIPBOARD_LIMITS, PNG_END, PNG_HEADER_BYTES, PNG_SIGNATURE };
