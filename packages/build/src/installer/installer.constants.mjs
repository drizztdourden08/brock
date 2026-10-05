/* @layer tooling-scripts @kind constants */
const INSTALLER_DIR = 'build/installer';
const HEADER_OVERRIDE = 'header.png';
const SPLASH_OVERRIDE = 'splash.png';
const INSTALLER_OVERRIDES = [HEADER_OVERRIDE, SPLASH_OVERRIDE];

const PREVIEW_DIR = 'release/installer-preview';
const PREVIEW_SCALE = 2;
const PREVIEW_MANIFEST_URL = 'https://example.invalid/install.json';
const PREVIEW_SCREENS = ['checking', 'welcome', 'licence', 'location', 'location-portable', 'progress', 'done', 'error', 'handoff'];
const PREVIEW_SPLASH = 'setup-splash.png';
const PREVIEW_MARK = 'mark.png';

const MARK_SIZE = 256;
const DEFAULT_MARK = './logos/mark.svg';
const BRAND_MARK_PNG = `mark/mark-${MARK_SIZE}.png`;
const TILED_ICON = 'build/icons/png/icon-256.png';
const PUBLIC_DIR = 'public';
const LICENCE_STAGED = 'licence.txt';
const MARK_STAGED = 'logo-256.png';

const THEME_KEYS = ['bg', 'surface', 'hairline', 'text', 'textDim', 'textFaint', 'primary', 'onPrimary'];
const OPTIONAL_THEME_KEYS = ['border', 'textMuted', 'gradientDarkFrom', 'gradientDarkTo'];

const FALLBACK_THEME = {
  bg: '#12100e',
  surface: '#1b1815',
  hairline: '#322b24',
  text: '#ece6da',
  textDim: '#a89e8d',
  textFaint: '#7c7365',
  onPrimary: '#1a1207',
  track: '#221e1a',
  stamp: '#463f36',
};

const TRACK_SURFACE_SHARE = 0.7;
const STAMP_HAIRLINE_SHARE = 0.73;
const VIA_SHARE = 0.5;

const COLOUR_MACROS = {
  BG: 'bg', SURFACE: 'surface', HAIRLINE: 'hairline', TEXT: 'text', DIM: 'dim', FAINT: 'faint', ACCENT: 'accent',
  ON_ACCENT: 'onAccent', TRACK: 'track', STAMP: 'stamp', HEADER_INK: 'ink',
};
const LOOK_MACROS = { FROM: 'from', VIA: 'via', TO: 'to' };

const SHORTCUT_LOCATIONS = { desktop: 'Desktop', startMenu: 'StartMenuRoot' };
const NO_SHORTCUTS = 'None';

const SPLASH_MARK = 96;
const SPLASH_GAP = 18;
const SPLASH_NAME_SIZE = 24;
const SPLASH_FONT = 'Segoe UI';
const TITLE_TTF = 'chakra-petch/chakra-petch-latin-600-normal.ttf';
const WINDOWS_PLATFORM = 3;
const FAMILY_NAME_IDS = [16, 1];
const AA_TEXT_RATIO = 4.5;
const SPLASH_FALLBACK_INKS = ['#ffffff', '#000000'];

export {
  INSTALLER_DIR, HEADER_OVERRIDE, SPLASH_OVERRIDE, INSTALLER_OVERRIDES, PREVIEW_DIR, PREVIEW_SCALE, PREVIEW_MANIFEST_URL,
  PREVIEW_SCREENS, PREVIEW_SPLASH, PREVIEW_MARK, MARK_SIZE, DEFAULT_MARK, BRAND_MARK_PNG, TILED_ICON, PUBLIC_DIR, LICENCE_STAGED, MARK_STAGED, THEME_KEYS, OPTIONAL_THEME_KEYS,
  FALLBACK_THEME, COLOUR_MACROS, LOOK_MACROS, TRACK_SURFACE_SHARE, STAMP_HAIRLINE_SHARE, VIA_SHARE, SHORTCUT_LOCATIONS, NO_SHORTCUTS, SPLASH_MARK,
  SPLASH_GAP, SPLASH_NAME_SIZE, SPLASH_FONT, TITLE_TTF, WINDOWS_PLATFORM, FAMILY_NAME_IDS, AA_TEXT_RATIO, SPLASH_FALLBACK_INKS,
};
