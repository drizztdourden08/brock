/* @layer core @kind test */
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { JobSnapshot } from '@drizztdourden08/brock-core/types';
import type { JobHandle, MainContext } from '@drizztdourden08/brock-electron/main';
import { createCatalogLinks } from '../src/links/catalog-links';
import { createCatalogClient } from '../src/main/catalog-client';
import { catalogUrl as urlOf } from '../src/main/catalog-url';
import type { CatalogConfig, CatalogInstaller } from '../src/main/catalog-config.type';
import { configureCatalog } from '../src/main/configure-catalog';
import { parseRegistry } from '../src/main/parse-registry';
import { checkGrant } from '../src/main/check-grant';
import { parseGrant } from '../src/main/parse-grant';
import { verifyDownload } from '../src/main/verify-download';

afterEach(() => {
  vi.unstubAllGlobals();
});

const memoryFiles = (): FileStore & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return {
    data,
    readText: (path) => Promise.resolve(data.get(path) ?? null),
    writeText: (path, text) => { data.set(path, text); return Promise.resolve(); },
    readBytes: () => Promise.resolve(null),
    writeBytes: () => Promise.resolve(),
    list: () => Promise.resolve([]),
    remove: (path) => { data.delete(path); return Promise.resolve(); },
    exists: (path) => Promise.resolve(data.has(path)),
    mkdir: () => Promise.resolve(),
    stat: () => Promise.resolve(null),
  };
};

const fakeJobs = () => {
  const running = new Set<string>();
  const steps: string[] = [];
  const controller = new AbortController();
  const job = (id: string): JobHandle => {
    running.add(id);
    const handle: JobHandle = {
      id, signal: controller.signal, step: (step) => { steps.push(step); }, progress: () => undefined, line: () => undefined, log: () => undefined,
      skip: () => undefined, done: () => undefined, fail: () => undefined,
      run: async (work) => { try { return await work(handle); } finally { running.delete(id); } },
    };
    return handle;
  };
  const list = () => [...running].map((id) => ({ id, state: 'running' }) as JobSnapshot);
  return { job, list, steps, controller };
};

const PACK = new TextEncoder().encode('pack bytes');
const SHA = createHash('sha256').update(PACK).digest('hex');

const grantFor = (version: number, sha256 = SHA) => ({
  itemId: 'abc', version, label: 'Hyrule Music', url: 'https://cdn.example.com/abc.msul', bytes: PACK.byteLength, sha256, container: 'msul', kind: 'music',
});

const fetchStub = (grant: () => object) => vi.fn((url: RequestInfo | URL) => {
  const href = url instanceof Request ? url.url : String(url);
  if (href.startsWith('https://api.example.com/items/abc/download')) return Promise.resolve(Response.json(grant()));
  if (href === 'https://cdn.example.com/abc.msul') return Promise.resolve(new Response(PACK));
  if (href.startsWith('https://api.example.com/items')) return Promise.resolve(Response.json({ items: [{ id: 'abc' }], nextCursor: null }));
  return Promise.resolve(new Response('{}', { status: 401 }));
});

const setup = (grant: () => object = () => grantFor(1)) => {
  const files = memoryFiles();
  const jobs = fakeJobs();
  const emit = vi.fn();
  const context: Partial<MainContext> = { files, job: jobs.job, jobs: { start: jobs.job, list: jobs.list, cancel: () => undefined, dismiss: () => undefined }, emit };
  const ctx = context as MainContext;
  const installed: string[] = [];
  const installer: CatalogInstaller = {
    install: async ({ file, grant: answered }) => {
      expect(await readFile(file)).toEqual(Buffer.from(PACK));
      installed.push(`${answered.label} ${answered.version}`);
      return { installedName: `hyrule-${answered.version}` };
    },
    uninstall: vi.fn(() => Promise.resolve()),
  };
  const onRelease = vi.fn(() => 2);
  const fetch = fetchStub(grant);
  vi.stubGlobal('fetch', fetch);
  const config: CatalogConfig = {
    label: 'Hookshop', endpoint: { baseUrl: 'https://api.example.com', fetch }, installers: { msul: installer }, onRelease,
    schema: { item: (value) => value as { id: string }, page: (value) => value as { items: { id: string }[]; nextCursor: null } },
  };
  return { catalog: configureCatalog(ctx, config), files, jobs, emit, installer, installed, onRelease };
};

describe('install links', () => {
  const links = createCatalogLinks('relic-of-the-past');

  it('reads exactly an install link of the app scheme and writes it back', () => {
    expect(links.parse('relic-of-the-past://install/abc_1-2?v=3')).toEqual({ itemId: 'abc_1-2', version: 3 });
    expect(links.parse('RELIC-OF-THE-PAST://install/abc/')).toEqual({ itemId: 'abc', version: null });
    expect(links.format({ itemId: 'abc', version: 3 })).toBe('relic-of-the-past://install/abc?v=3');
    expect(links.fromArgv(['app.exe', '--flag', 'relic-of-the-past://install/abc'])).toEqual({ itemId: 'abc', version: null });
  });

  it('refuses any other host, path, query, fragment or id', () => {
    for (const bad of ['relic-of-the-past://open/abc', 'relic-of-the-past://install/a/b', 'relic-of-the-past://install/abc?x=1', 'relic-of-the-past://install/abc#v', 'relic-of-the-past://install/__x__', 'other://install/abc', `relic-of-the-past://install/${'a'.repeat(300)}`]) {
      expect(links.parse(bad)).toBeNull();
    }
    expect(() => createCatalogLinks('Bad Scheme')).toThrow(/scheme/);
  });
});

describe('the download checks', () => {
  const config = { label: 'Hookshop', installers: { msul: {} as CatalogInstaller }, maxBytes: 100 };

  it('parses a grant and refuses one it cannot trust', () => {
    expect(parseGrant(grantFor(1))).toMatchObject({ itemId: 'abc', kind: 'music', meta: {} });
    expect(() => parseGrant({ ...grantFor(1), sha256: 'nope' })).toThrow(/did not describe/);
    expect(() => checkGrant(parseGrant(grantFor(1)), 'other', config)).toThrow(/different item/);
    expect(() => checkGrant(parseGrant({ ...grantFor(1), container: 'zip' }), 'abc', config)).toThrow(/cannot install/);
    expect(() => checkGrant(parseGrant({ ...grantFor(1), url: 'http://cdn' }), 'abc', config)).toThrow(/not secure/);
    expect(() => checkGrant(parseGrant({ ...grantFor(1), bytes: 500 }), 'abc', config)).toThrow(/larger/);
  });

  it('accepts only the exact size and digest', () => {
    const grant = parseGrant(grantFor(1));
    expect(() => verifyDownload(grant, { bytes: PACK.byteLength, sha256: SHA.toUpperCase() })).not.toThrow();
    expect(() => verifyDownload(grant, { bytes: PACK.byteLength + 1, sha256: SHA })).toThrow(/does not match/);
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
    expect(result).toMatchObject({ ok: true, record: { itemId: 'abc', installedName: 'hyrule-1', kind: 'music', container: 'msul' } });
    expect(jobs.steps).toEqual(['grant', 'download', 'verify', 'unpack']);
    expect(installed).toEqual(['Hyrule Music 1']);
    expect(await catalog.installed()).toHaveLength(1);
    expect(emit).toHaveBeenCalledWith('catalog:changed');
  });

  it('updates over the old copy: the new one first, then the old one released and removed', async () => {
    let version = 1;
    const { catalog, installer, onRelease } = setup(() => grantFor(version));
    await catalog.install({ itemId: 'abc', version: null });
    version = 2;
    await catalog.install({ itemId: 'abc', version: null });
    expect(onRelease).toHaveBeenCalledWith(expect.objectContaining({ installedName: 'hyrule-1' }), 'hyrule-2', expect.anything());
    expect(installer.uninstall).toHaveBeenCalledOnce();
    expect((await catalog.installed()).map((record) => record.installedName)).toEqual(['hyrule-2']);
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

  it('holds install links until the window takes them, then sends each one', () => {
    const { catalog, emit } = setup();
    catalog.links.listen('relic-of-the-past');
    expect(catalog.links.deliverUrl('relic-of-the-past://install/abc?v=2')).toBe(true);
    expect(catalog.links.deliverUrl('https://example.com')).toBe(false);
    expect(catalog.links.take()).toEqual([{ itemId: 'abc', version: 2 }]);
    catalog.links.deliverUrl('relic-of-the-past://install/def');
    expect(emit).toHaveBeenCalledWith('catalog:link', { itemId: 'def', version: null });
  });
});
