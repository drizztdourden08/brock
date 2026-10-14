/* @layer core @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CatalogInstaller } from '../src/main/catalog-config.type';
import { createCatalogLinks } from '../src/links/catalog-links';
import { createCatalogClient } from '../src/main/catalog-client';
import { catalogUrl as urlOf } from '../src/main/catalog-url';
import { parseRegistry } from '../src/main/parse-registry';
import { checkGrant } from '../src/main/check-grant';
import { parseGrant } from '../src/main/parse-grant';
import { verifyDownload } from '../src/main/verify-download';
import { ITEM, SHA, grantFor, setup } from './catalog-sim/catalog-setup';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('install links', () => {
  const links = createCatalogLinks('my-app');

  it('reads exactly an install link of the app scheme and writes it back', () => {
    expect(links.parse('my-app://install/abc_1-2?v=3')).toEqual({ itemId: 'abc_1-2', version: 3 });
    expect(links.parse('MY-APP://install/abc/')).toEqual({ itemId: 'abc', version: null });
    expect(links.format({ itemId: 'abc', version: 3 })).toBe('my-app://install/abc?v=3');
    expect(links.fromArgv(['app.exe', '--flag', 'my-app://install/abc'])).toEqual({ itemId: 'abc', version: null });
  });

  it('refuses any other host, path, query, fragment or id', () => {
    for (const bad of ['my-app://open/abc', 'my-app://install/a/b', 'my-app://install/abc?x=1', 'my-app://install/abc#v', 'my-app://install/__x__', 'other://install/abc', `my-app://install/${'a'.repeat(300)}`]) {
      expect(links.parse(bad)).toBeNull();
    }
    expect(() => createCatalogLinks('Bad Scheme')).toThrow(/scheme/);
  });
});

describe('the download checks', () => {
  const config = { label: 'Library', installers: { zip: {} as CatalogInstaller }, maxBytes: 100 };

  it('parses a grant and refuses one it cannot trust', () => {
    expect(parseGrant(grantFor(1))).toMatchObject({ itemId: 'abc', kind: 'preset', meta: {} });
    expect(() => parseGrant({ ...grantFor(1), sha256: 'nope' })).toThrow(/did not describe/);
    expect(() => checkGrant(parseGrant(grantFor(1)), 'other', config)).toThrow(/different item/);
    expect(() => checkGrant(parseGrant({ ...grantFor(1), container: 'rar' }), 'abc', config)).toThrow(/cannot install/);
    expect(() => checkGrant(parseGrant({ ...grantFor(1), url: 'http://cdn' }), 'abc', config)).toThrow(/not secure/);
    expect(() => checkGrant(parseGrant({ ...grantFor(1), bytes: 500 }), 'abc', config)).toThrow(/larger/);
  });

  it('accepts only the exact size and digest', () => {
    const grant = parseGrant(grantFor(1));
    expect(() => verifyDownload(grant, { bytes: ITEM.byteLength, sha256: SHA.toUpperCase() })).not.toThrow();
    expect(() => verifyDownload(grant, { bytes: ITEM.byteLength + 1, sha256: SHA })).toThrow(/does not match/);
  });

  it('skips a damaged registry instead of failing', () => {
    expect(parseRegistry('not json').records).toEqual([]);
    expect(parseRegistry(JSON.stringify({ version: 1, records: [{ itemId: 'x' }] })).records).toEqual([]);
  });
});

describe('the catalogue client', () => {
  it('fills route params and drops empty query values', () => {
    expect(urlOf('https://api.example.com/', { route: { method: 'GET', path: '/items/:id' }, params: { id: 'a b' }, query: { kind: null, cursor: 'c' } })).toBe('https://api.example.com/items/a%20b?cursor=c');
  });

  it('reports a 401 as signed out and runs the unauthorized hook', async () => {
    const onUnauthorized = vi.fn();
    const call = createCatalogClient({ baseUrl: 'https://api.example.com', onUnauthorized, fetch: () => Promise.resolve(Response.json({ error: 'Sign in first.' }, { status: 401 })) });
    await expect(call({ route: { method: 'GET', path: '/home' } })).rejects.toMatchObject({ status: 401, message: 'Sign in first.' });
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });
});

describe('installing and uninstalling', () => {
  it('installs through a job, records it, and tells the window', async () => {
    const { catalog, jobs, emit, installed } = setup();
    expect(await catalog.reads().list()).toEqual([{ id: 'abc' }]);
    const result = await catalog.install({ itemId: 'abc', version: null });
    expect(result).toMatchObject({ ok: true, record: { itemId: 'abc', installedName: 'starter-1', kind: 'preset', container: 'zip' } });
    expect(jobs.steps).toEqual(['grant', 'download', 'locked', 'verify', 'unpack']);
    expect(installed).toEqual(['Starter Preset 1']);
    expect(await catalog.installed()).toHaveLength(1);
    expect(emit).toHaveBeenCalledWith('catalog:changed');
  });

  it('updates over the old copy: the new one first, then the old one released and removed', async () => {
    let version = 1;
    const { catalog, installer, onRelease } = setup(() => grantFor(version));
    await catalog.install({ itemId: 'abc', version: null });
    version = 2;
    await catalog.install({ itemId: 'abc', version: null });
    expect(onRelease).toHaveBeenCalledWith(expect.objectContaining({ installedName: 'starter-1' }), 'starter-2', expect.anything());
    expect(installer.uninstall).toHaveBeenCalledOnce();
    expect((await catalog.installed()).map((record) => record.installedName)).toEqual(['starter-2']);
  });

  it('refuses a download whose digest does not match and installs nothing', async () => {
    const { catalog, installed } = setup(() => grantFor(1, '0'.repeat(64)));
    const result = await catalog.install({ itemId: 'abc', version: null });
    expect(result).toMatchObject({ ok: false, cancelled: false });
    expect(result.ok ? '' : result.error).toMatch(/does not match/);
    expect(installed).toEqual([]);
    expect(await catalog.installed()).toEqual([]);
  });

  it('uninstalls by releasing what used it, then the files, then the record', async () => {
    const { catalog, installer, onRelease } = setup();
    await catalog.install({ itemId: 'abc', version: null });
    expect(await catalog.uninstall('abc')).toEqual({ ok: true, released: 2 });
    expect(onRelease).toHaveBeenLastCalledWith(expect.objectContaining({ itemId: 'abc' }), null, expect.anything());
    expect(installer.uninstall).toHaveBeenCalledOnce();
    expect(await catalog.installed()).toEqual([]);
    expect(await catalog.uninstall('not an id')).toMatchObject({ ok: false });
  });

  it('takes install links of its scheme from ctx.onOpen, holds them until the window takes them, then sends each one', () => {
    const { catalog, emit, openHandlers } = setup();
    catalog.links.listen('my-app');
    const open = (url: string, scheme: string) => openHandlers.forEach((handler) => handler({ kind: 'url', url, scheme, source: 'launch' }));
    open('my-app://install/abc?v=2', 'my-app');
    open('other://install/zzz', 'other');
    openHandlers.forEach((handler) => handler({ kind: 'file', path: 'X:/a.preset', ext: 'preset', source: 'running' }));
    expect(catalog.links.take()).toEqual([{ itemId: 'abc', version: 2 }]);
    open('my-app://install/def', 'my-app');
    expect(emit).toHaveBeenCalledWith('catalog:link', { itemId: 'def', version: null });
  });

  it('takes a link the app hands over itself and refuses anything else', () => {
    const { catalog } = setup();
    catalog.links.listen('my-app');
    expect(catalog.links.deliverUrl('my-app://install/abc')).toBe(true);
    expect(catalog.links.deliverUrl('https://example.com')).toBe(false);
    expect(catalog.links.take()).toEqual([{ itemId: 'abc', version: null }]);
  });
});
