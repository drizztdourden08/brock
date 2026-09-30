/* @layer tooling-scripts @kind logic */

/**
 * @typedef {object} ImagePlacement
 * @property {number} x @property {number} y @property {number} size
 * @property {string} [extra]  attributes such as a filter
 */

/**
 * @param {import('./mark-source.mjs').MarkSource} source
 * @param {ImagePlacement} placement
 * @returns {string}  an SVG image element, centred in its square
 */
const imageSvg = ({ data, mime }, { x, y, size, extra = '' }) =>
  `<image href="data:${mime};base64,${data.toString('base64')}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"${extra}/>`;

export { imageSvg };
