/* @layer tooling-scripts @kind logic */
import { HTML_ESCAPES } from './splash.constants.mjs';

/**
 * @param {string} text
 * @returns {string}
 */
const escapeHtml = (text) => text.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);

export { escapeHtml };
