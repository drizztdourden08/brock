/* @layer tooling-scripts @kind logic */
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

const escapeText = (text) => text.replace(/[&<>"']/g, (char) => ESCAPES[char]);

const TITLE_TAG = /<title[^>]*>[\s\S]*?<\/title>/i;

const metaPattern = (attr, name) => new RegExp(`<meta\\b[^>]*\\b${attr}\\s*=\\s*["']${name}["'][^>]*>`, 'i');

const withMeta = (html, attr, name, value) => {
  const tag = `<meta ${attr}="${name}" content="${escapeText(value)}" />`;
  const pattern = metaPattern(attr, name);
  if (pattern.test(html)) return html.replace(pattern, () => tag);
  if (attr === 'property') return html;
  return html.replace(/<\/head>/i, () => `  ${tag}\n  </head>`);
};

const withTitle = (html, title) => {
  const tag = `<title>${escapeText(title)}</title>`;
  if (TITLE_TAG.test(html)) return html.replace(TITLE_TAG, () => tag);
  return html.replace(/<\/head>/i, () => `  ${tag}\n  </head>`);
};

const withDepth = (html, depth) => {
  const up = '../'.repeat(depth);
  return html.replace(/\b(src|href)=(["'])\.\//gi, (all, attr, quote) => `${attr}=${quote}${up}`);
};

const withDescription = (html, description) => {
  if (description === null) return html;
  return withMeta(withMeta(html, 'name', 'description', description), 'property', 'og:description', description);
};

/**
 * @param {string} html the built index.html
 * @param {{ path: string, title: string, description: string | null }} route
 * @param {boolean} relativeBase true when the build's URLs are relative (base "./" or "")
 * @returns {string} the route page
 */
const routeHtml = (html, route, relativeBase) => {
  const titled = withMeta(withTitle(html, route.title), 'property', 'og:title', route.title);
  const based = relativeBase ? withDepth(titled, route.path.split('/').length) : titled;
  return withDescription(based, route.description);
};

export { routeHtml };
