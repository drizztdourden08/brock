/* @layer tooling-scripts @kind config */
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { appTools } from './app-tools.mjs';
import { findWorkspaceRoot } from './workspace.mjs';
import { declaredExternalsPlugin } from './declared-externals.mjs';
import { devServerPort } from './dev-server-port.mjs';
import { loadBrockConfig } from './load-config.mjs';
import { ownsSplashPage } from './splash/owns-splash-page.mjs';
import { screensPlugin } from './screens/screens-plugin.mjs';
import { widgetsPlugin } from './widgets/widgets-plugin.mjs';
import { titleBarPlugin } from './title-bar/title-bar-plugin.mjs';
import { toursPlugin } from './tours/tours-plugin.mjs';
import { splashPlugin } from './splash/splash-plugin.mjs';
import { servedDirs } from './served-dirs.mjs';
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
  const { product } = await loadBrockConfig(rootDir);
  const src = resolve(rootDir, 'src');
  const alias = { '@app': src };
  const sources = sourceDependencies(rootDir);
  const external = externalDependenciesOf(rootDir, sources);
  const externalizeDeps = { exclude: sources, include: [...external.keys()] };
  const rollupOptions = { plugins: [declaredExternalsPlugin(rootDir, external)] };
  const base = {
    main: {
      resolve: { alias, dedupe: SHARED_SINGLETONS },
      build: {
        externalizeDeps,
        outDir: resolve(rootDir, 'dist/electron'),
        rollupOptions,
        lib: { entry: { main: resolve(rootDir, 'electron/main.ts') } },
      },
    },
    preload: {
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
      plugins: [react(), splashPlugin({ rootDir, product }), screensPlugin({ rootDir }), widgetsPlugin({ rootDir }), titleBarPlugin({ rootDir }), toursPlugin({ rootDir })],
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
