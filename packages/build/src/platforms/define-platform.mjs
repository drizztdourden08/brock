/* @layer tooling-scripts @kind logic */

/**
 * @typedef {import('./platform.type.mjs').Platform} Platform
 */

/**
 * @param {Partial<Platform> & { id: string, label: string }} spec
 * @returns {Readonly<Platform>}
 */
const definePlatform = (spec) => {
  if (!/^[a-z]+$/.test(spec.id)) throw new Error(`definePlatform: "${spec.id}" is not a platform id`);
  return Object.freeze({
    supported: true,
    doctor: [],
    scaffold: [],
    ciJob: null,
    releaseJob: null,
    secrets: [],
    secretsHint: null,
    managed: null,
    ...spec,
  });
};

export { definePlatform };
