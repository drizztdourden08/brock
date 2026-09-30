/* @layer tooling-scripts @kind logic */
import { escapeHtml } from './escape-html.mjs';
import { SPLASH_CSP } from './splash.constants.mjs';
import { SPLASH_SCRIPT } from './splash-script.mjs';

/**
 * @typedef {object} SplashPageInput
 * @property {string} name  The app name
 * @property {string} mark  The mark without its tile, relative to the page
 * @property {string} styles  Every rule, in cascade order
 */

/**
 * @param {SplashPageInput} input
 * @returns {string}  The splash window page: static HTML with no bundle
 */
const renderSplashPage = ({ name, mark, styles }) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="${SPLASH_CSP}" />
    <title>${escapeHtml(name)}</title>
    <style>
${styles}
    </style>
  </head>
  <body class="splash">
    <main class="splash__stage">
      <img class="splash__mark" src="${escapeHtml(mark)}" alt="" />
      <h1 class="splash__name">${escapeHtml(name)}</h1>
      <p class="splash__status" id="splash-status" aria-live="polite">Starting</p>
      <section class="splash__failure" id="splash-failure" hidden>
        <p class="splash__message" id="splash-message"></p>
        <div class="splash__actions">
          <button class="splash__button splash__button--primary" id="splash-retry" type="button">Retry</button>
          <button class="splash__button" id="splash-logs" type="button">Open logs</button>
          <button class="splash__button" id="splash-quit" type="button">Quit</button>
        </div>
      </section>
    </main>
    <span class="splash__version" id="splash-version"></span>
    <div class="splash__bar" id="splash-bar" role="progressbar" aria-label="Loading" aria-valuemin="0" aria-valuemax="100"><div class="splash__fill"></div></div>
    <script>${SPLASH_SCRIPT}</script>
  </body>
</html>
`;

export { renderSplashPage };
