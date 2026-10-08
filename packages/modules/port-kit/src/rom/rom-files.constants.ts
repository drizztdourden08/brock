/* @layer core @kind constants */
const ROMS_DIR = 'roms';
const ASSETS_DIR = 'assets';

const ROM_NAME_MAX = 255;
const ROM_NAME_FORBIDDEN = /[<>:"/\\|?*]/;
const ROM_NAME_RESERVED = /^(con|prn|aux|nul|com\d|lpt\d)(\.|$)/i;

export { ROMS_DIR, ASSETS_DIR, ROM_NAME_MAX, ROM_NAME_FORBIDDEN, ROM_NAME_RESERVED };
