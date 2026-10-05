/* @layer tooling-scripts @kind constants */
const SPLASH_PAGE = 'splash.html';
const SPLASH_STYLESHEET = 'splash-page.css';
const TESSERA_SPLASH_STYLESHEET = 'splash.css';
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const TOKEN_LAYERS = '@layer ds.base, ds.palette, ds.semantic;';
const TOKEN_FILES = [
  'scale.css', 'palette.css', 'ramps.css', 'canonical.css', 'space.css', 'size.css', 'radius.css', 'border.css', 'typography.css',
  'motion.css', 'opacity.css',
];
const TOKENS_DIR = 'src/tokens';
const FONTS_DIR = 'fonts';
const TITLE_FONT = { css: 'chakra-petch/chakra-petch.css', file: 'chakra-petch-latin-600-normal.woff2' };
const SPLASH_FONTS = [
  { css: 'inter/inter.css', file: 'InterVariable-subset.woff2' },
  TITLE_FONT,
];
const SPLASH_CSP = "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src 'self' data:; font-src data:";

export { FONTS_DIR, HTML_ESCAPES, SPLASH_CSP, SPLASH_FONTS, SPLASH_PAGE, SPLASH_STYLESHEET, TESSERA_SPLASH_STYLESHEET, TITLE_FONT, TOKEN_FILES, TOKEN_LAYERS, TOKENS_DIR };
