/* @layer core @kind constants */
const SAVE_SLOT_MAGIC = [0x50, 0x4b, 0x53, 0x56] as const;
const SAVE_SLOT_VERSION = 1;
const SAVE_SLOT_HEADER_BYTES = 9;

const SAVES_DIR = 'saves';
const QUICK_DIR = 'quick';
const MANIFEST_FILE = 'manifest.json';
const SRAM_FILE = 'sram.dat';
const SRAM_BACKUP_FILE = 'sram.bak';
const STATE_EXTENSION = '.sav';
const SCREENSHOT_EXTENSION = '.png';
const QUICK_FILE_PATTERN = /^save(\d+)\.sav$/;

export {
  SAVE_SLOT_MAGIC, SAVE_SLOT_VERSION, SAVE_SLOT_HEADER_BYTES, SAVES_DIR, QUICK_DIR, MANIFEST_FILE, SRAM_FILE,
  SRAM_BACKUP_FILE, STATE_EXTENSION, SCREENSHOT_EXTENSION, QUICK_FILE_PATTERN,
};
