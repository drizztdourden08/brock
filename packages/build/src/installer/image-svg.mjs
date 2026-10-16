/* @layer tooling-scripts @kind logic */

/**
 * @typedef {object} ImagePlacement
 * @property {number} x @property {number} y @property {number} size
 * @property {number} [height]  the box height when it is not a square
 * @property {string} [extra]  attributes such as a filter
 */

/**
 * @param {import('./read-image.mjs').ImageSource} source
 * @param {ImagePlacement} placement
 * @returns {string}  an SVG image element, centred in its box
 */
const imageSvg = ({ data, mime }, { x, y, size, height = size, extra = '' }) =>
  `<image href="data:${mime};base64,${data.toString('base64')}" x="${x}" y="${y}" width="${size}" height="${height}" preserveAspectRatio="xMidYMid meet"${extra}/>`;

export { imageSvg };
