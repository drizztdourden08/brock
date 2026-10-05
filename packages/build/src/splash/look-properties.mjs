/* @layer tooling-scripts @kind logic */

/**
 * @param {import('@drizztdourden08/brock-core/look').DarkPair | null} dark
 * @returns {string}  the dark splash ground, when the app has one
 */
const darkProperties = (dark) => (dark ? `\n  --look-dark-from: ${dark.from};\n  --look-dark-to: ${dark.to};` : '');

/**
 * @param {import('@drizztdourden08/brock-core/look').ResolvedLook} look
 * @param {import('@drizztdourden08/brock-core/look').DarkPair | null} [dark]
 * @returns {string}  The look as custom properties
 */
const lookProperties = ({ from, via, to, angle, accent, ink, shade }, dark = null) => `:root {
  --look-from: ${from};
  --look-via: ${via ?? `color-mix(in oklab, ${from}, ${to})`};
  --look-to: ${to};
  --look-angle: ${angle}deg;
  --look-accent: ${accent};
  --look-ink: ${ink};
  --look-shade: ${shade};${darkProperties(dark)}
}`;

export { lookProperties };
