/* @layer tooling-scripts @kind logic */
import { EMPTY_ROOT } from './splash.constants.mjs';

/**
 * @param {import('./splash-look.mjs').SplashLook} look
 * @returns {string}
 */
const bootSplashStyle = ({ background, accent }) => `<style>
      #boot-splash { position: fixed; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px; background: ${background}; }
      #boot-splash img { width: 192px; height: 192px; }
      #boot-splash .boot-splash__spinner { width: 28px; height: 28px; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.12); border-top-color: ${accent}; animation: boot-splash-rotate 0.7s linear infinite; }
      @keyframes boot-splash-rotate { to { transform: rotate(360deg); } }
    </style>`;

/**
 * @param {string} html
 */
const withBootingClass = (html) => {
  if (/<html[^>]*\bclass="[^"]*\bbooting\b/i.test(html)) return html;
  if (/<html[^>]*\bclass="/i.test(html)) return html.replace(/(<html[^>]*\bclass=")/i, '$1booting ');
  return html.replace(/<html\b/i, '<html class="booting"');
};

/**
 * @param {string} html  The app's index.html
 * @param {import('./splash-look.mjs').SplashLook} look
 * @returns {string}  The page with the boot splash in its empty root
 */
const injectBootSplash = (html, look) => {
  const title = /<title>/i.test(html) ? '' : `  <title>${look.title}</title>\n  `;
  const head = `${title}  ${bootSplashStyle(look)}\n  </head>`;
  const markup = `<div id="root"><div id="boot-splash"><img src="${look.logo}" alt="" /><div class="boot-splash__spinner"></div></div></div>`;
  return withBootingClass(html).replace(/<\/head>/i, head).replace(EMPTY_ROOT, markup);
};

export { injectBootSplash };
