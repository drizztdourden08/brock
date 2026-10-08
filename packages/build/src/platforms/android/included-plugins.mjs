/* @layer tooling-scripts @kind logic */
import { declaredDependencies } from '../../modules/declared-dependencies.mjs';
import { BUILT_IN_MODULES, packageForModule } from '../../modules/registry.mjs';

/**
 * @param {string} rootDir
 * @param {{ modules?: string[] }} config
 * @returns {string[] | null} the packages to wire, or null for all
 */
const includedPlugins = (rootDir, config) => {
  const listed = new Set(config.modules ?? []);
  const off = new Set(BUILT_IN_MODULES.filter((id) => !listed.has(id)).map(packageForModule));
  const declared = declaredDependencies(rootDir);
  const kept = declared.filter((name) => !off.has(name));
  return kept.length === declared.length ? null : kept;
};

export { includedPlugins };
