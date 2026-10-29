/* @layer tooling-scripts @kind logic */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { build, version as esbuildVersion } from 'esbuild';
import { hashValue } from '../store/hash-tree.mjs';
import { ASSET_LOADERS } from './packages.constants.mjs';

/**
 * @param {{ platform: 'node' | 'browser', target: string, define?: Record<string, string> }} input what changes the output
 * @returns {{ settings: Record<string, unknown>, buildKey: string }} the full settings and their short key
 */
const packageBuildKey = ({ platform, target, define = {} }) => {
  const settings = { compiler: `esbuild@${esbuildVersion}`, format: 'esm', platform, target, define, jsx: 'automatic' };
  return { settings, buildKey: `${platform}-${hashValue(settings)}` };
};

const packageNameOf = (path) => {
  const parts = path.split('/');
  return path.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
};

const isPackageImport = (item) => item.external && !item.path.startsWith('.') && !item.path.startsWith('node:');

/**
 * @param {{ outputs: Record<string, { entryPoint?: string, imports?: { path: string, kind: string, external?: boolean }[] }> }} metafile
 * @param {Map<string, string>} keyOfEntry export key by entry file, as esbuild names it
 * @returns {Record<string, string[]>} runtime packages by export key
 */
const runtimeImportsByKey = (metafile, keyOfEntry) => {
  const reach = (start) => {
    const names = new Set();
    const seen = new Set();
    const queue = [start];
    while (queue.length > 0) {
      const path = queue.shift();
      if (seen.has(path)) continue;
      seen.add(path);
      for (const item of metafile.outputs[path]?.imports ?? []) {
        if (item.kind !== 'import-statement') continue;
        if (isPackageImport(item)) names.add(packageNameOf(item.path));
        else if (!item.external) queue.push(item.path);
      }
    }
    return [...names].sort();
  };
  return Object.fromEntries(Object.entries(metafile.outputs)
    .filter(([, output]) => output.entryPoint && keyOfEntry.has(output.entryPoint))
    .map(([path, output]) => [keyOfEntry.get(output.entryPoint), reach(path)]));
};

/**
 * @param {{ dir: string, name: string, version: string, entries: { key: string, file: string, out: string }[], pkg: Record<string, any> }} source the installed package
 * @param {Record<string, unknown>} settings what packageBuildKey gave
 * @param {string} outDir an empty folder
 * @returns {Promise<{ imports: Record<string, string[]> }>} runtime packages by export key
 */
const compilePackage = async (source, settings, outDir) => {
  const result = await build({
    absWorkingDir: source.dir,
    entryPoints: Object.fromEntries(source.entries.map((entry) => [entry.out, join(source.dir, entry.file)])),
    outdir: outDir,
    bundle: true,
    splitting: true,
    format: 'esm',
    platform: settings.platform,
    target: settings.target,
    define: settings.define,
    jsx: 'automatic',
    packages: 'external',
    loader: ASSET_LOADERS,
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'assets/[name]-[hash]',
    metafile: true,
    logLevel: 'silent',
    legalComments: 'inline',
  });
  const exports = Object.fromEntries([...source.entries.map((entry) => [entry.key, `./${entry.out}.js`]), ['./package.json', './package.json']]);
  const manifest = {
    name: source.name,
    version: source.version,
    type: 'module',
    exports,
    dependencies: source.pkg.dependencies ?? {},
    peerDependencies: source.pkg.peerDependencies ?? {},
  };
  writeFileSync(join(outDir, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  const keyOfEntry = new Map(source.entries.map((entry) => [entry.file.replace(/^\.\//, ''), entry.key]));
  return { imports: runtimeImportsByKey(result.metafile, keyOfEntry) };
};

export { compilePackage, packageBuildKey };
