/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { build } from 'vite';
import { defineBrockSite } from '../src/site/define-brock-site.mjs';
import { siteRoutesPlugin } from '../src/site/site-routes-plugin.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

const PAGE = [
  '<!doctype html>',
  '<html lang="en">',
  '  <head>',
  '    <title>Home</title>',
  '    <meta name="description" content="The home page" />',
  '    <meta property="og:title" content="Home" />',
  '    <meta property="og:description" content="The home page" />',
  '  </head>',
  '  <body><div id="root"></div><script type="module" src="./main.js"></script></body>',
  '</html>',
  '',
].join('\n');

const ROUTES = [
  { path: 'privacy', title: 'Privacy', description: 'How we treat your data' },
  { path: 'legal/terms', title: 'Terms & "Conditions"', description: 'Use <b>at</b> your own risk' },
];

const site = { site: { id: 'docs' }, ports: { offset: 1 } };

const buildSite = async (routes, base = '/') => {
  const root = tempRepo({ 'src/index.html': PAGE, 'src/main.js': "document.title = 'x';\n" });
  const src = join(root, 'src');
  await build({
    root: src,
    base,
    logLevel: 'silent',
    configFile: false,
    plugins: routes.length > 0 ? [siteRoutesPlugin({ routes: defineBrockSite({ ...site, build: { routes } }).build.routes })] : [],
    build: { outDir: join(root, 'dist'), emptyOutDir: true, rollupOptions: { input: { index: join(src, 'index.html') } } },
  });
  return join(root, 'dist');
};

const read = (dist, path) => readFileSync(join(dist, path), 'utf8');

afterEach(removeTempRepos);

describe('build.routes', () => {
  it('writes a page per route with its own title and description', async () => {
    const dist = await buildSite(ROUTES);
    const privacy = read(dist, 'privacy/index.html');
    expect(privacy).toContain('<title>Privacy</title>');
    expect(privacy).toContain('<meta name="description" content="How we treat your data" />');
    expect(privacy).toContain('<meta property="og:title" content="Privacy" />');
    expect(privacy).toContain('<meta property="og:description" content="How we treat your data" />');
    const terms = read(dist, 'legal/terms/index.html');
    expect(terms).toContain('<title>Terms &amp; &quot;Conditions&quot;</title>');
    expect(terms).toContain('content="Use &lt;b&gt;at&lt;/b&gt; your own risk"');
    expect(read(dist, 'index.html')).toContain('<title>Home</title>');
  });

  it('keeps asset URLs that resolve from the nested folder', async () => {
    const dist = await buildSite(ROUTES);
    const script = /src="(\/assets\/[^"]+\.js)"/.exec(read(dist, 'privacy/index.html'))?.[1];
    expect(script).toBeDefined();
    expect(existsSync(join(dist, script))).toBe(true);
    expect(read(dist, 'legal/terms/index.html')).toContain(`src="${script}"`);
    const prefixed = await buildSite(ROUTES, '/repo/');
    expect(read(prefixed, 'privacy/index.html')).toMatch(/src="\/repo\/assets\/[^"]+\.js"/);
  });

  it('turns relative URLs into ones that climb out of the nested folder', async () => {
    const dist = await buildSite(ROUTES, './');
    expect(read(dist, 'index.html')).toMatch(/src="\.\/assets\//);
    expect(read(dist, 'privacy/index.html')).toMatch(/src="\.\.\/assets\//);
    expect(read(dist, 'legal/terms/index.html')).toMatch(/src="\.\.\/\.\.\/assets\//);
    const [asset] = readdirSync(join(dist, 'assets'));
    expect(existsSync(join(dist, 'privacy', '..', 'assets', asset))).toBe(true);
  });

  it('adds the title and the description when the page has none', async () => {
    const root = tempRepo({ 'src/index.html': '<!doctype html>\n<html>\n  <head></head>\n  <body></body>\n</html>\n' });
    const src = join(root, 'src');
    const routes = defineBrockSite({ ...site, build: { routes: [{ path: 'terms', title: 'Terms', description: 'The terms' }] } }).build.routes;
    await build({ root: src, logLevel: 'silent', configFile: false, plugins: [siteRoutesPlugin({ routes })], build: { outDir: join(root, 'dist'), emptyOutDir: true } });
    const page = read(join(root, 'dist'), 'terms/index.html');
    expect(page).toContain('<title>Terms</title>');
    expect(page).toContain('<meta name="description" content="The terms" />');
    expect(page).not.toContain('og:description');
  });

  it('writes no extra page without routes', async () => {
    const dist = await buildSite([]);
    expect(readdirSync(dist).sort()).toEqual(['assets', 'index.html']);
    expect(defineBrockSite(site).build.routes).toEqual([]);
  });
});

describe('the routes of defineBrockSite', () => {
  const routes = (list) => () => defineBrockSite({ ...site, build: { routes: list } });

  it('keeps a path with nested segments and a missing description', () => {
    expect(defineBrockSite({ ...site, build: { routes: [{ path: 'a1/b-2', title: ' Terms ' }] } }).build.routes).toEqual([{ path: 'a1/b-2', title: 'Terms', description: null }]);
  });

  it.each(['/privacy', 'privacy/', '../privacy', 'a/../b', 'privacy.html', 'a//b', '-privacy', 'a b', ''])('refuses the path "%s" with a message', (path) => {
    expect(routes([{ path, title: 'T' }])).toThrow(/brock\.site\.ts: build\.routes \[0\]\.path .* no leading or trailing slash and no dots/);
  });

  it('refuses a missing title, a blank description, a duplicate and a non-list', () => {
    expect(routes([{ path: 'privacy' }])).toThrow(/\[0\]\.title must be a non-empty string/);
    expect(routes([{ path: 'privacy', title: 'P', description: ' ' }])).toThrow(/\[0\]\.description/);
    expect(routes([{ path: 'privacy', title: 'P' }, { path: 'Privacy', title: 'Q' }])).toThrow(/lists "Privacy" twice/);
    expect(routes('privacy')).toThrow(/is a list of/);
    expect(routes([null])).toThrow(/\[0\] must be/);
  });
});
