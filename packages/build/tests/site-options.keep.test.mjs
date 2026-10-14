/* @layer tooling-scripts @kind test */
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addSite } from '../src/site/add-site.mjs';
import { defineBrockSite } from '../src/site/define-brock-site.mjs';
import { loadSite } from '../src/site/load-site.mjs';
import { proxyCollisions } from '../src/site/proxy-collisions.mjs';
import { siteViewPath, siteViewValues } from '../src/site/site-view-names.mjs';
import { syncSites } from '../src/site/sync-sites.mjs';
import { BUILD_PACKAGE, linkBuildPackage, removeTempRepos, tempRepo } from './temp-repo.mjs';

const DEFINE_SITE = pathToFileURL(join(BUILD_PACKAGE, 'src/site/define-brock-site.mjs')).href;

const appRepo = () => linkBuildPackage(tempRepo({
  '.git/HEAD': 'ref: refs/heads/main\n',
  'pnpm-workspace.yaml': 'packages: []\n',
  'brock.workspace.mjs': 'export default {};\n',
  'brock.config.ts': "export default { product: { id: 'atlas', name: 'Atlas', ports: { base: 30000 }, icons: { brand: 'tessera' } } };\n",
  'package.json': JSON.stringify({ name: 'atlas' }),
  'tessera.config.json': '{}\n',
}));

const read = (root, path) => readFileSync(join(root, path), 'utf8');

let warnings = [];
beforeEach(() => {
  warnings = [];
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
  vi.spyOn(console, 'warn').mockImplementation((line) => warnings.push(line));
});
afterEach(() => {
  vi.restoreAllMocks();
  removeTempRepos();
});

describe('the views of a new site', () => {
  it('are named after the site, so two sites never share a part name', async () => {
    const root = appRepo();
    await addSite({ rootDir: root, name: 'store' });
    await addSite({ rootDir: root, name: 'help-desk' });
    expect(readdirSync(join(root, 'apps/store/src/views')).sort()).toEqual(['StoreHome', 'StoreShell', 'StoreSignIn']);
    expect(readdirSync(join(root, 'apps/help-desk/src/views')).sort()).toEqual(['HelpDeskHome', 'HelpDeskShell', 'HelpDeskSignIn']);
    expect(read(root, 'apps/store/src/main.tsx')).toContain("import { StoreShell } from './views/StoreShell';");
    const shell = read(root, 'apps/help-desk/src/views/HelpDeskShell/HelpDeskShell.tsx');
    expect(shell).toContain("import { HelpDeskSignIn } from '../HelpDeskSignIn';");
    expect(shell).toContain('<Box className="help-desk-shell">');
    expect(read(root, 'apps/help-desk/src/views/HelpDeskSignIn/HelpDeskSignIn.css')).toContain('.help-desk-sign-in__card {');
    expect(read(root, 'apps/help-desk/src/views/HelpDeskSignIn/HelpDeskSignIn.type.ts')).toContain('interface HelpDeskSignInProps');
    expect(read(root, 'apps/store/src/views/StoreHome/index.ts')).toContain("export { StoreHome } from './StoreHome';");
    expect(`${read(root, 'apps/store/src/views/StoreShell/StoreShell.tsx')}${read(root, 'apps/store/src/main.tsx')}`).not.toMatch(/__[A-Z_]+__|SiteShell/);
  });

  it('maps each template view folder and file, and leaves the rest', () => {
    const values = siteViewValues('docs');
    expect(values).toMatchObject({ SHELL: 'DocsShell', SHELL_CLASS: 'docs-shell', SIGN_IN: 'DocsSignIn', SIGN_IN_CLASS: 'docs-sign-in', HOME: 'DocsHome' });
    expect(siteViewPath('src/views/SignIn/SignIn.usage.ts', values)).toBe('src/views/DocsSignIn/DocsSignIn.usage.ts');
    expect(siteViewPath('src/views/Home/index.ts', values)).toBe('src/views/DocsHome/index.ts');
    expect(siteViewPath('src/hooks/useSitePath.ts', values)).toBe('src/hooks/useSitePath.ts');
  });
});

describe('a served folder under the /api proxy', () => {
  it('is named by sync, since its files would go to the API', async () => {
    const root = appRepo();
    await addSite({ rootDir: root, name: 'docs', api: '4' });
    expect(warnings).toEqual([]);
    mkdirSync(join(root, 'apps/docs/src/api'), { recursive: true });
    expect(await syncSites(root, { check: true })).toBe(0);
    expect(warnings).toEqual([expect.stringMatching(/^brock check: apps\/docs\/src\/api: the dev server serves src at the page root, so a request for \/api\/\.\.\. goes to the \/api proxy/)]);
  });

  it('is fine without an API, or under another proxy path', () => {
    const root = tempRepo({ 'src/api/client.ts': '' });
    const site = defineBrockSite({ site: { id: 'docs' }, ports: { offset: 1 } });
    expect(proxyCollisions(root, site, 'apps/docs')).toEqual([]);
    expect(proxyCollisions(root, { ...site, api: defineBrockSite({ ...site, api: { portOffset: 2, path: '/v1' } }).api }, 'apps/docs')).toEqual([]);
    expect(proxyCollisions(root, { ...site, api: defineBrockSite({ ...site, api: { portOffset: 2 } }).api }, 'apps/docs')).toHaveLength(1);
  });
});

describe('brock.site.ts options', () => {
  it('merges tsconfig.compilerOptions over the managed site tsconfig, which takes .ts imports', async () => {
    const root = appRepo();
    await addSite({ rootDir: root, name: 'docs' });
    expect(JSON.parse(read(root, 'apps/docs/tsconfig.json')).compilerOptions).toMatchObject({ allowImportingTsExtensions: true, paths: { '@app/*': ['./src/*'] } });
    const site = defineBrockSite({ site: { id: 'docs' }, ports: { offset: 1 }, tsconfig: { compilerOptions: { noUncheckedIndexedAccess: false } }, build: { define: { __SITE__: 'docs' } } });
    expect(site.tsconfig.compilerOptions).toEqual({ noUncheckedIndexedAccess: false });
    expect(site.build.define).toEqual({ __SITE__: '"docs"' });
    expect(() => defineBrockSite({ site: { id: 'docs' }, ports: { offset: 1 }, tsconfig: { compilerOptions: 'strict' } })).toThrow(/brock\.site\.ts tsconfig\.compilerOptions must be an object/);
  });

  it('can import the port offsets from a shared .ts file under Node', () => {
    const root = tempRepo({
      'ports.constants.ts': 'export const TOOL_PORTS = { docs: 3, api: 4 } as const;\n',
      'apps/docs/brock.site.ts': `import { defineBrockSite } from '${DEFINE_SITE}';\nimport { TOOL_PORTS } from '../../ports.constants.ts';\n\nexport default defineBrockSite({ site: { id: 'docs' }, ports: { offset: TOOL_PORTS.docs }, api: { portOffset: TOOL_PORTS.api } });\n`,
    });
    const url = pathToFileURL(join(root, 'apps/docs/brock.site.ts')).href;
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', `const site = (await import('${url}')).default; console.log(JSON.stringify([site.ports.offset, site.api.target.portOffset]));`], { encoding: 'utf8' });
    expect(result.stderr.replace(/.*ExperimentalWarning.*\n?|.*--trace-warnings.*\n?/g, '')).toBe('');
    expect(JSON.parse(result.stdout)).toEqual([3, 4]);
  });

  it('loads the same file through loadSite', async () => {
    const root = tempRepo({
      'ports.constants.ts': 'export const TOOL_PORTS = { docs: 5 };\n',
      'apps/docs/brock.site.ts': `import { defineBrockSite } from '${DEFINE_SITE}';\nimport { TOOL_PORTS } from '../../ports.constants.ts';\n\nexport default defineBrockSite({ site: { id: 'docs' }, ports: { offset: TOOL_PORTS.docs } });\n`,
    });
    expect((await loadSite(join(root, 'apps/docs'))).ports.offset).toBe(5);
  });
});
