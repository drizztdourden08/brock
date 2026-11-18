/* @layer root-config @kind config */
const MINUTE = 60_000;

const config = { options: { test: { timeouts: { changed: 20 * MINUTE } } } };

export default config;
