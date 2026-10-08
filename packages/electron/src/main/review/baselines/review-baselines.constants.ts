/* @layer electron-main @kind constants */
const BASELINES_FLAG = '--review-baselines';
const BLESS_FLAG = '--review-bless';
const PLATFORM_NAMES: Readonly<Partial<Record<NodeJS.Platform, string>>> = { win32: 'windows', darwin: 'macos', linux: 'linux' };
const PINNED_SWITCHES: readonly (readonly [string, string?])[] = [
  ['force-device-scale-factor', '1'],
  ['force-color-profile', 'srgb'],
  ['disable-lcd-text'],
  ['force-prefers-reduced-motion'],
  ['num-raster-threads', '1'],
  ['disable-partial-raster'],
];
const PINNED_CSS = '*, *::before, *::after { caret-color: transparent !important; }';
const PNG_EXTENSION = '.png';
const SETTLE_FRAME_MS = 150;
const PREPARE_TIMEOUT_MS = 1000;
const STABLE_TRIES = 8;
const STABLE_GAP_MS = 120;
const BYTE_ORDER_MARK = new RegExp(`^${String.fromCharCode(0xfeff)}`);

export {
  BASELINES_FLAG, BLESS_FLAG, BYTE_ORDER_MARK, PINNED_CSS, PINNED_SWITCHES, PLATFORM_NAMES, PNG_EXTENSION, PREPARE_TIMEOUT_MS, SETTLE_FRAME_MS, STABLE_GAP_MS, STABLE_TRIES,
};
