/* @layer tooling-scripts @kind config */

const SCOPE = '@drizztdourden08';

const BUILT_IN_MODULES = ['updater', 'secrets', 'input', 'display', 'port-kit', 'catalog'];

/**
 * @type {Record<string, string>} id -> package name
 */
const MODULE_PACKAGES = Object.fromEntries(BUILT_IN_MODULES.map((id) => [id, `${SCOPE}/brock-${id}`]));

/**
 * @param {string} id
 * @returns {string | null}
 */
const packageForModule = (id) => MODULE_PACKAGES[id] ?? null;

/**
 * @param {string} input
 * @returns {{ spec: string, id: string | null}}
 */
const parseAddInput = (input) => {
  const builtIn = packageForModule(input);
  if (builtIn) return { spec: builtIn, id: input };
  return { spec: input, id: null };
};

/**
 * @param {string} spec
 */
const packageNameOf = (spec) => {
  const at = spec.lastIndexOf('@');
  return at > 0 ? spec.slice(0, at) : spec;
};

export { BUILT_IN_MODULES, MODULE_PACKAGES, packageForModule, parseAddInput, packageNameOf };
