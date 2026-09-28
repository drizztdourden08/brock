/* @layer tooling-scripts @kind logic */
import { escapeHtml } from './escape-html.mjs';
import { SPLASH_DEFAULTS } from './splash.constants.mjs';

/**
 * @typedef {{ title: string, logo: string, background: string, accent: string }} SplashLook  HTML-escaped values
 */

/**
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @returns {SplashLook}
 */
const splashLook = (product) => ({
  title: escapeHtml(product.window?.title ?? product.name),
  logo: escapeHtml(product.logos?.app ?? SPLASH_DEFAULTS.logo),
  background: escapeHtml(product.window?.backgroundColor ?? SPLASH_DEFAULTS.background),
  accent: escapeHtml(product.window?.splash?.accent ?? SPLASH_DEFAULTS.accent),
});

export { splashLook };
