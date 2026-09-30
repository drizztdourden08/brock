/* @layer tooling-scripts @kind logic */

/**
 * @param {import('@drizztdourden08/brock-core/look').ResolvedLook} look
 * @returns {string}  The look as custom properties
 */
const lookProperties = ({ from, via, to, angle, accent }) => `:root {
  --look-from: ${from};
  --look-via: ${via ?? `color-mix(in oklab, ${from}, ${to})`};
  --look-to: ${to};
  --look-angle: ${angle}deg;
  --look-accent: ${accent};
}`;

export { lookProperties };
