/* @layer tooling-scripts @kind barrel */
export { defineBrockConfig, CONFIG_FILE } from './config.mjs';
export { loadBrockConfig } from './load-config.mjs';
export { defineBrockViteConfig, sourceDependencies } from './vite-config.mjs';
export { createBuilderConfig, loadBuilderConfig } from './builder-config.mjs';
export { ensureElectron } from './ensure-electron.mjs';
export { syncApp, BROCK_VERSION } from './modules/sync.mjs';
export { appendModuleId } from './commands/add.mjs';
export { resolveModules } from './modules/resolve.mjs';
export { BUILT_IN_MODULES, MODULE_PACKAGES, packageForModule, parseAddInput } from './modules/registry.mjs';
export { MANAGED_FILES } from './managed/templates.mjs';
export { findWorkspaceRoot, mergeCatalog } from './workspace.mjs';
export { installLauncher } from './launcher/install-launcher.mjs';
export { launcherName } from './launcher/launcher-name.mjs';
