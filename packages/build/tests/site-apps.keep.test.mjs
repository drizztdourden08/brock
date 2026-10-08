/* @layer tooling-scripts @kind test */
import { existsSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { appDirs } from '../src/commands/app-dirs.mjs';
import { addSite, parseApi } from '../src/site/add-site.mjs';
import { defineBrockSite } from '../src/site/define-brock-site.mjs';
import { loadSite } from '../src/site/load-site.mjs';
import { siteDirs } from '../src/site/site-dirs.mjs';
import { rebased } from '../src/site/site-package.mjs';
import { siteProxy, siteServer } from '../src/site/site-server.mjs';
import { withSitesGlob } from '../src/site/sites-glob.mjs';
import { syncSites } from '../src/site/sync-sites.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

const BUILD_PACKAGE = resolve(import.meta.dirname, '..');

const appRepo = () => {
  const root = tempRepo({
    '.git/HEAD': 'ref: refs/heads/main\n',
    'pnpm-workspace.yaml': "packages: []\n\ncatalog:\n  vite: ^7.3.3\n",
    'brock.workspace.mjs': 'export default {};\n',
    'brock.scope': '@atlas\n',
    'brock.config.ts': "export default { product: { id: 'atlas', name: 'Atlas', ports: { base: 30000 }, icons: { brand: 'rotp' } } };\n",
    'package.json': JSON.stringify({ name: 'atlas', devDependencies: { '@drizztdourden08/brock-build': 'link:X:/brock/packages/build', typescript: 'catalog:', '@types/react': 'link:./vendor/types-react' } }),
    'tessera.config.json': '{ "$schema": "./node_modules/@drizztdourden08/tessera/tessera.config.schema.json" }\n',
    'knip.json': JSON.stringify({ entry: ['src/main.tsx'], project: ['src/**/*.ts'], ignoreDependencies: ['x'] }),
  });
  mkdirSync(join(root, 'node_modules', '@drizztdourden08'), { recursive: true });
  symlinkSync(BUILD_PACKAGE, join(root, 'node_modules', '@drizztdourden08', 'brock-build'), 'junction');
  return root;
};

const read = (root, path) => readFileSync(join(root, path), 'utf8');

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  removeTempRepos();
});

describe('defineBrockSite', () => {
  const site = { site: { id: 'docs' }, ports: { offset: 1 } };

  it('fills the defaults and reads the api as a URL or a port offset', () => {
    expect(defineBrockSite(site)).toEqual({
      site: { id: 'docs', name: 'docs', brand: null }, ports: { offset: 1, base: null }, api: null, build: { nodePolyfills: false, aliases: {} },
    });
    expect(defineBrockSite({ ...site, api: 'https://api.example.com' }).api).toEqual({ path: '/api', target: { url: 'https://api.example.com' }, changeOrigin: false, stripPath: false });
    expect(defineBrockSite({ ...site, api: { portOffset: 2, path: '/v1', stripPath: true } }).api).toMatchObject({ path: '/v1', target: { portOffset: 2 }, stripPath: true });
  });

  it('refuses a bad id, an offset outside the tool ports and an api with no target', () => {
    expect(() => defineBrockSite({ ...site, site: { id: 'My Site' } })).toThrow(/site\.id/);
    expect(() => defineBrockSite({ ...site, ports: { offset: 0 } })).toThrow(/ports\.offset/);
    expect(() => defineBrockSite({ ...site, api: { path: '/api' } })).toThrow(/url .* or portOffset/);
    expect(() => defineBrockSite({ ...site, api: { portOffset: 12 } })).toThrow(/api\.portOffset/);
  });

  it('proxies the api path to the URL or to the same slot\'s tool port, stripping the path only on request', () => {
    const portOf = (offset) => 30020 + offset;
    expect(siteProxy(null, portOf)).toEqual({});
    expect(siteProxy(defineBrockSite({ ...site, api: { portOffset: 2 } }).api, portOf)['/api']).toEqual({ target: 'http://localhost:30022', changeOrigin: false });
    const stripped = siteProxy(defineBrockSite({ ...site, api: { url: 'http://x', stripPath: true } }).api, portOf)['/api'];
    expect(stripped.rewrite('/api/items')).toBe('/items');
  });
});

describe('the workspace glob and the specs', () => {
  it('adds apps/* to every shape of packages', () => {
    expect(withSitesGlob('packages: []\n\ncatalog:\n')).toBe("packages:\n  - 'apps/*'\n\ncatalog:\n");
    expect(withSitesGlob("packages:\n  - 'packages/*'\n")).toBe("packages:\n  - 'apps/*'\n  - 'packages/*'\n");
    expect(withSitesGlob("packages: ['packages/*']\n")).toBe("packages: ['packages/*', 'apps/*']\n");
    expect(withSitesGlob('catalog: {}\n')).toBe("packages:\n  - 'apps/*'\ncatalog: {}\n");
  });

  it('moves a relative link to the site folder and keeps every other spec', () => {
    expect(rebased('link:./vendor/x', 'X:/repo', 'X:/repo/apps/docs')).toBe('link:../../vendor/x');
    expect(rebased('link:X:/brock/packages/build', 'X:/repo', 'X:/repo/apps/docs')).toBe('link:X:/brock/packages/build');
    expect(rebased('^1.0.0', 'X:/repo', 'X:/repo/apps/docs')).toBe('^1.0.0');
    expect(parseApi('3')).toBe(3);
    expect(() => parseApi('ftp://x')).toThrow(/--api/);
  });
});

describe('brock site add', () => {
  it('writes the site beside the app, joins the workspace, registers it and syncs its managed files', async () => {
    const root = appRepo();
    const result = await addSite({ rootDir: root, name: 'store-front', api: '2' });
    expect(result).toEqual({ siteDir: 'apps/store-front', port: 1, changed: ['pnpm-workspace.yaml', 'tessera.config.json', 'knip.json'] });
    expect(read(root, 'pnpm-workspace.yaml')).toContain("packages:\n  - 'apps/*'\n");
    const site = await loadSite(join(root, 'apps/store-front'));
    expect(site).toMatchObject({ site: { id: 'store-front', name: 'Store Front', brand: 'rotp' }, ports: { offset: 1 }, api: { target: { portOffset: 2 } } });
    expect(read(root, 'apps/store-front/src/main.tsx')).toContain("import '@drizztdourden08/tessera/palettes/rotp.css';");
    expect(read(root, 'apps/store-front/src/main.tsx')).toContain('<TesseraProvider overrides={TESSERA_OVERRIDES}>');
    const pkg = JSON.parse(read(root, 'apps/store-front/package.json'));
    expect(pkg.name).toBe('@atlas/store-front');
    expect(pkg.devDependencies).toMatchObject({ '@drizztdourden08/brock-build': 'link:X:/brock/packages/build', typescript: 'catalog:', vite: 'catalog:', '@types/react': 'link:../../vendor/types-react' });
    expect(JSON.parse(read(root, 'tessera.config.json')).apps['apps/store-front']).toEqual({ parts: { views: 'apps/store-front/src/views' }, theme: { css: 'apps/store-front/src/theme.css' } });
    expect(JSON.parse(read(root, 'knip.json')).workspaces).toEqual({
      '.': { entry: ['src/main.tsx'], project: ['src/**/*.ts'] },
      'apps/store-front': { entry: ['src/main.tsx', 'brock.site.ts', 'vite.config.ts'], project: ['src/**/*.{ts,tsx}'] },
    });
    for (const file of ['apps/store-front/vite.config.ts', 'apps/store-front/tsconfig.json', '.github/workflows/ci-store-front.yml']) expect(existsSync(join(root, file))).toBe(true);
    expect(appDirs(root)).toEqual(['.']);
    expect(siteDirs(root)).toEqual(['apps/store-front']);
  });

  it('gives the next site a free tool port, past the first site and its API', async () => {
    const root = appRepo();
    await addSite({ rootDir: root, name: 'sanctuary', api: '2' });
    expect((await addSite({ rootDir: root, name: 'store' })).port).toBe(3);
    await expect(addSite({ rootDir: root, name: 'store' })).rejects.toThrow(/exists already/);
    await expect(addSite({ rootDir: root, name: 'Bad Name' })).rejects.toThrow(/lowercase/);
  });

  it('serves on the app block in the checkout\'s slot, with its API in the same slot', async () => {
    const root = appRepo();
    await addSite({ rootDir: root, name: 'docs', api: '4' });
    writeFileSync(join(root, '.brock-port-slot'), '2\n');
    const siteDir = join(root, 'apps/docs');
    const server = await siteServer(siteDir, await loadSite(siteDir));
    expect(server).toMatchObject({ port: 30021, strictPort: true, base: 30000, slot: 2 });
    expect(server.proxy['/api'].target).toBe('http://localhost:30024');
  });

  it('keeps the CI and the managed files in sync, and reports drift', async () => {
    const root = appRepo();
    await addSite({ rootDir: root, name: 'docs' });
    expect(await syncSites(root, { check: true })).toBe(0);
    const workflow = read(root, '.github/workflows/ci-docs.yml');
    expect(workflow).toContain('APP_DIR: apps/docs\n');
    expect(workflow).toContain('pnpm exec brock affected "$APP_DIR"');
    expect(workflow).toContain('pnpm --dir "$APP_DIR" exec brock site build');
    expect(workflow).not.toMatch(/firebase|gcloud/i);
    writeFileSync(join(root, 'apps/docs/vite.config.ts'), 'export default {};\n');
    expect(await syncSites(root, { check: true })).toBe(1);
    expect(await syncSites(root, { check: false })).toBe(0);
    expect(await syncSites(root, { check: true })).toBe(0);
  });
});
