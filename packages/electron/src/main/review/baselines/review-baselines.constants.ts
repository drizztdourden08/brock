/* @layer electron-main @kind constants */
const BASELINES_FLAG = '--review-baselines';
const BLESS_FLAG = '--review-bless';
const FORCE_FLAG = '--force';
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
const PREPARE_CEILING_MS = 30_000;
const QUIET_FRAMES = 4;
const STABLE_TRIES = 8;
const PINNED_AREA = { width: 1920, height: 1080 } as const;
const BYTE_ORDER_MARK = new RegExp(`^${String.fromCharCode(0xfeff)}`);

export {
  BASELINES_FLAG, BLESS_FLAG, BYTE_ORDER_MARK, FORCE_FLAG, PINNED_AREA, PINNED_CSS, PINNED_SWITCHES, PLATFORM_NAMES, PNG_EXTENSION, PREPARE_CEILING_MS,
  QUIET_FRAMES, STABLE_TRIES,
};
