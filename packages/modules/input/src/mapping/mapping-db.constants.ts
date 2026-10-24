/* @layer core @kind constants */
import type { ControllerGamepadType } from '../device.type';
import type { GuidIds } from './mapping-entry.type';

const INPUT_DIR = 'input';
const DB_FILE = 'gamecontrollerdb.txt';
const USER_DB_PATH = `${INPUT_DIR}/${DB_FILE}`;
const BUNDLED_DB_SPECIFIER = '@drizztdourden08/brock-input/gamecontrollerdb.txt';
const GUID_PATTERN = /^[0-9a-fA-F]{24,}$/;
const XINPUT_PSEUDO_GUID = 'xinput';

const GUID_HEX_LENGTH = 32;
const GUID_VENDOR_BYTE = 4;
const GUID_PRODUCT_BYTE = 8;
const GUID_SPACER_BYTES = [6, 10] as const;
const PLATFORM_PREFIX = 'platform:';
const NON_INPUT_KEYS: ReadonlySet<string> = new Set(['platform', 'crc', 'hint', 'sdk>=', 'sdk<=', 'type', 'face']);
const PLATFORM_NAMES: Readonly<Record<string, string>> = { win32: 'Windows', linux: 'Linux', darwin: 'Mac OS X' };
const NO_IDS: GuidIds = { vid: 0, pid: 0 };

const VENDOR_TYPES: Readonly<Record<number, ControllerGamepadType>> = {
  0x045e: 'xboxone',
  0x054c: 'ps4',
  0x057e: 'switch-pro',
};

const NAME_TYPES: ReadonlyArray<readonly [RegExp, ControllerGamepadType]> = [
  [/xbox|xinput/i, 'xboxone'],
  [/playstation|dualshock|dualsense|\bps[2-5]\b/i, 'ps4'],
  [/nintendo|switch|joy-?con/i, 'switch-pro'],
];

export {
  INPUT_DIR, DB_FILE, USER_DB_PATH, BUNDLED_DB_SPECIFIER, GUID_PATTERN, XINPUT_PSEUDO_GUID,
  GUID_HEX_LENGTH, GUID_VENDOR_BYTE, GUID_PRODUCT_BYTE, GUID_SPACER_BYTES, PLATFORM_PREFIX, NON_INPUT_KEYS, PLATFORM_NAMES, NO_IDS, VENDOR_TYPES, NAME_TYPES,
};
