/* @layer tooling-scripts @kind logic */
import { escapeHtml } from './escape-html.mjs';
import { SPLASH_CSP } from './splash.constants.mjs';
import { SPLASH_SCRIPT } from './splash-script.mjs';

/**
 * @typedef {object} SplashPageInput
 * @property {string} name  The app name
 * @property {string} mark  The mark without its tile, relative to the page
 * @property {string} styles  Every rule, in cascade order
 * @property {string | null} [palette]  The data-palette of the page root, the app's brand
 */

/**
 * @param {SplashPageInput} input
 * @returns {string}  The splash window page: static HTML with no bundle
 */
const renderSplashPage = ({ name, mark, styles, palette = null }) => `<!DOCTYPE html>
<html lang="en"${palette ? ` data-palette="${escapeHtml(palette)}"` : ''}>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="${SPLASH_CSP}" />
    <title>${escapeHtml(name)}</title>
    <style>
${styles}
    </style>
  </head>
  <body class="ts-splash splash">
    <main class="ts-stage">
      <img class="splash__mark" src="${escapeHtml(mark)}" alt="" />
      <h1 class="ts-title splash__name">${escapeHtml(name)}</h1>
      <p class="ts-status" id="splash-status" aria-live="polite">Starting</p>
      <section class="splash__failure" id="splash-failure" hidden>
        <p class="ts-status ts-status--danger splash__message" id="splash-message"></p>
        <div class="ts-actions">
          <button class="ts-button ts-button--primary" id="splash-retry" type="button">Retry</button>
          <button class="ts-button" id="splash-logs" type="button">Open logs</button>
          <button class="ts-button" id="splash-quit" type="button">Quit</button>
        </div>
      </section>
    </main>
    <span class="ts-version" id="splash-version"></span>
    <div class="ts-progress ts-progress--edge" id="splash-bar" role="progressbar" aria-label="Loading" aria-valuemin="0" aria-valuemax="100"></div>
    <script>${SPLASH_SCRIPT}</script>
  </body>
</html>
`;

export { renderSplashPage };
