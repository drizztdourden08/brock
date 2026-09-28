/* @layer tooling-scripts @kind constants */
const SPLASH_DEFAULTS = { background: '#000000', accent: '#3b6fe0', logo: './logos/icon-256.png' };
const SPLASH_PAGE = 'splash.html';
const INDEX_PAGE = 'index.html';
const EMPTY_ROOT = /<div id="root">\s*<\/div>/;
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export { SPLASH_DEFAULTS, SPLASH_PAGE, INDEX_PAGE, EMPTY_ROOT, HTML_ESCAPES };
