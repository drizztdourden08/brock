/* @layer electron-main @kind constants */
const BASELINES_FLAG = '--review-baselines';
const BLESS_FLAG = '--review-bless';
const PLATFORM_NAMES: Readonly<Partial<Record<NodeJS.Platform, string>>> = { win32: 'windows', darwin: 'macos', linux: 'linux' };
const PINNED_SWITCHES: readonly (readonly [string, string?])[] = [
  ['force-device-scale-factor', '1'],
  ['force-color-profile', 'srgb'],
  ['disable-lcd-text'],
];
const PINNED_CSS = '*, *::before, *::after { caret-color: transparent !important; }';
const PNG_EXTENSION = '.png';

export { BASELINES_FLAG, BLESS_FLAG, PINNED_CSS, PINNED_SWITCHES, PLATFORM_NAMES, PNG_EXTENSION };
