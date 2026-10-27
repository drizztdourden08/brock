/* @layer tooling-scripts @kind config */
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { appTools } from './app-tools.mjs';
import { appAliases } from './build-options/app-aliases.mjs';
import { WORKER_FORMAT } from './build-options/build-options.constants.mjs';
import { defineValues } from './build-options/define-values.mjs';
import { nodePolyfillPlugins } from './build-options/node-polyfills.mjs';
import { buildReusePlugin } from './build-reuse/build-reuse-plugin.mjs';
import { devOnlyPlugin } from './dev-only/dev-only-plugin.mjs';
import { esmShimPlacement } from './build-options/esm-shim-placement.mjs';
import { findWorkspaceRoot } from './workspace.mjs';
import { declaredExternalsPlugin } from './declared-externals.mjs';
import { devServerPort } from './dev-server-port.mjs';
import { loadBrockConfig } from './load-config.mjs';
import { ownsSplashPage } from './splash/owns-splash-page.mjs';
import { metaModulesPlugin } from './meta-modules/meta-modules-plugin.mjs';
import { screensPlugin } from './screens/screens-plugin.mjs';
import { widgetsPlugin } from './widgets/widgets-plugin.mjs';
import { titleBarPlugin } from './title-bar/title-bar-plugin.mjs';
import { startupPlugin } from './startup/startup-plugin.mjs';
import { toursPlugin } from './tours/tours-plugin.mjs';
import { toolbarsPlugin } from './toolbars/toolbars-plugin.mjs';
import { splashPlugin } from './splash/splash-plugin.mjs';
import { servedDirs } from './served-dirs.mjs';
import { optimizeDepsPlugin } from './optimize-deps/optimize-deps-plugin.mjs';
import { sharedDepsCachePlugin } from './shared-deps-cache/shared-deps-cache-plugin.mjs';
import { SHARED_SINGLETONS, SOURCE_SCOPE, SOURCE_SPECS, SPLASH_PRELOAD } from './vite.constants.mjs';

const readScope = (dir) => {
  const file = join(dir, 'brock.scope');
  return existsSync(file) ? readFileSync(file, 'utf8').trim() : null;
};

/**
 * @param {string} rootDir
 * @returns {string | null}
 */
const ownScope = (rootDir) => readScope(rootDir) ?? readScope(findWorkspaceRoot(rootDir) ?? rootDir);

const readPackage = (rootDir) => {
  try {
    return JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf8'));
  } catch {
    return {};
  }
};

/**
 * @param {string} rootDir
 * @returns {string[]}
 */
const sourceDependencies = (rootDir) => {
  const pkg = readPackage(rootDir);
  const scope = ownScope(rootDir);
  const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  return Object.entries(deps)
    .filter(([name, spec]) =>
      name.startsWith(SOURCE_SCOPE)
      || SOURCE_SPECS.some((prefix) => String(spec).startsWith(prefix))
      || (scope !== null && name.startsWith(`${scope}/`)))
    .map(([name]) => name);
};

const packageJsonOf = (rootDir, name) => {
  const file = join(rootDir, 'node_modules', ...name.split('/'), 'package.json');
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

/**
 * @param {string} rootDir
 * @param {string[]} sources
 * @returns {Map<string, string>}
 */
const externalDependenciesOf = (rootDir, sources) => {
  const external = new Map();
  const seen = new Set();
  const visit = (name) => {
    if (seen.has(name)) return;
    seen.add(name);
    const pkg = packageJsonOf(rootDir, name);
    for (const [dep, spec] of Object.entries(pkg?.dependencies ?? {})) {
      const isSource = dep.startsWith(SOURCE_SCOPE) || SOURCE_SPECS.some((prefix) => String(spec).startsWith(prefix));
      if (isSource) visit(dep);
      else if (!external.has(dep)) external.set(dep, String(spec));
    }
  };
  for (const name of sources) visit(name);
  return external;
};

/**
 * @param {string} rootDir
 * @returns {Record<string, string>}  The splash preload entry, if any
 */
const splashPreloadEntry = (rootDir) => {
  try {
    return { 'splash-preload': createRequire(join(rootDir, 'package.json')).resolve(SPLASH_PRELOAD) };
  } catch {
    return {};
  }
};

/**
 * @param {string} rootDir The app root (the folder holding brock.config.ts)
 * @param {import('electron-vite').UserConfig} [overrides] Merged over the base config
 * @returns {Promise<import('electron-vite').UserConfig>}
 */
const defineBrockViteConfig = async (rootDir, overrides = {}) => {
  const { mergeConfig, workspaceRootOf, react } = await appTools(rootDir);
  const { product, build } = await loadBrockConfig(rootDir);
  const src = resolve(rootDir, 'src');
  const alias = appAliases(rootDir, build);
  const polyfills = await nodePolyfillPlugins(rootDir, build);
  const sources = sourceDependencies(rootDir);
  const external = externalDependenciesOf(rootDir, sources);
  const externalizeDeps = { exclude: sources, include: [...external.keys()] };
  const rollupOptions = { plugins: [declaredExternalsPlugin(rootDir, external)] };
  const define = defineValues(build?.define, 'brock.config.ts');
  const base = {
    main: {
      define,
      plugins: [buildReusePlugin({ rootDir, target: 'main' }), devOnlyPlugin({ rootDir }), esmShimPlacement()],
      resolve: { alias, dedupe: SHARED_SINGLETONS },
      build: {
        externalizeDeps,
        outDir: resolve(rootDir, 'dist/electron'),
        rollupOptions: { ...rollupOptions, input: { main: resolve(rootDir, 'electron/main.ts') } },
      },
    },
    preload: {
      define,
      plugins: [buildReusePlugin({ rootDir, target: 'preload' }), esmShimPlacement()],
      resolve: { alias, dedupe: SHARED_SINGLETONS },
      build: {
        externalizeDeps,
        outDir: resolve(rootDir, 'dist/preload'),
        rollupOptions,
        lib: { entry: { preload: resolve(rootDir, 'electron/preload.ts'), ...splashPreloadEntry(rootDir) } },
      },
    },
    renderer: {
      root: src,
      publicDir: resolve(rootDir, 'public'),
      define,
      plugins: [
        devOnlyPlugin({ rootDir }), metaModulesPlugin({ rootDir }), react(), ...polyfills(), optimizeDepsPlugin({ rootDir, aliases: alias, options: build?.optimizeDeps }), sharedDepsCachePlugin({ rootDir }),
        splashPlugin({ rootDir, product }), screensPlugin({ rootDir }), widgetsPlugin({ rootDir }), titleBarPlugin({ rootDir }), toursPlugin({ rootDir }), toolbarsPlugin({ rootDir }), startupPlugin({ rootDir }),
      ],
      worker: { format: WORKER_FORMAT, plugins: () => [devOnlyPlugin({ rootDir }), ...polyfills()] },
      resolve: { alias, dedupe: SHARED_SINGLETONS },
      server: { ...devServerPort(rootDir, product), fs: { allow: servedDirs(rootDir, sources, workspaceRootOf) } },
      build: {
        outDir: resolve(rootDir, 'dist/renderer'),
        rollupOptions: {
          input: {
            index: resolve(src, 'index.html'),
            ...(ownsSplashPage(rootDir) ? { splash: resolve(src, 'splash.html') } : {}),
          },
        },
      },
    },
  };
  return mergeConfig(base, overrides);
};

export { defineBrockViteConfig, sourceDependencies, externalDependenciesOf };
