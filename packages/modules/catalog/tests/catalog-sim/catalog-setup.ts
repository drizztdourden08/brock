/* @layer core @kind test */
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { expect, vi } from 'vitest';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { JobSnapshot, OpenRequest } from '@drizztdourden08/brock-core/types';
import type { JobHandle, MainContext } from '@drizztdourden08/brock-electron/main';
import type { InstalledRecord } from '../../src/catalog.type';
import type { CatalogConfig, CatalogInstaller } from '../../src/main/catalog-config.type';
import { configureCatalog } from '../../src/main/configure-catalog';

const memoryFiles = (): FileStore & { data: Map<string, string>; trashed: string[] } => {
  const data = new Map<string, string>();
  const trashed: string[] = [];
  return {
    data,
    trashed,
    readText: (path) => Promise.resolve(data.get(path) ?? null),
    writeText: (path, text) => { data.set(path, text); return Promise.resolve(); },
    readBytes: () => Promise.resolve(null),
    writeBytes: () => Promise.resolve(),
    list: () => Promise.resolve([]),
    remove: (path) => { data.delete(path); return Promise.resolve(); },
    exists: (path) => Promise.resolve(data.has(path)),
    mkdir: () => Promise.resolve(),
    stat: () => Promise.resolve(null),
    trash: (path) => { trashed.push(path); data.delete(path); return Promise.resolve(); },
  };
};

const fakeJobs = () => {
  const running = new Set<string>();
  const steps: string[] = [];
  const controller = new AbortController();
  const job = (id: string): JobHandle => {
    running.add(id);
    const handle: JobHandle = {
      id, signal: controller.signal, started: Promise.resolve(), ended: Promise.resolve('done'), step: (step) => { steps.push(step); }, progress: () => undefined, line: () => undefined, log: () => undefined,
      skip: () => undefined, done: () => undefined, fail: () => undefined, setCancellable: (on) => { steps.push(on ? 'cancellable' : 'locked'); },
      run: async (work) => { try { return await work(handle); } finally { running.delete(id); } },
    };
    return handle;
  };
  const list = () => [...running].map((id) => ({ id, state: 'running' }) as JobSnapshot);
  return { job, list, steps, controller };
};

const ITEM = new TextEncoder().encode('item bytes');
const SHA = createHash('sha256').update(ITEM).digest('hex');

const grantFor = (version: number, sha256 = SHA) => ({
  itemId: 'abc', version, label: 'Starter Preset', url: 'https://cdn.example.com/abc.zip', bytes: ITEM.byteLength, sha256, container: 'zip', kind: 'preset',
});

const fetchStub = (grant: () => object) => vi.fn((url: RequestInfo | URL) => {
  const href = url instanceof Request ? url.url : String(url);
  if (href.startsWith('https://api.example.com/items/abc/download')) return Promise.resolve(Response.json(grant()));
  if (href === 'https://cdn.example.com/abc.zip') return Promise.resolve(new Response(ITEM));
  if (href.startsWith('https://api.example.com/items')) return Promise.resolve(Response.json({ items: [{ id: 'abc' }], nextCursor: null }));
  return Promise.resolve(new Response('{}', { status: 401 }));
});

const contextOf = (files: FileStore, jobs: ReturnType<typeof fakeJobs>) => {
  const emit = vi.fn();
  const openHandlers: ((request: OpenRequest) => void)[] = [];
  const onOpen = (handler: (request: OpenRequest) => void) => {
    openHandlers.push(handler);
    return () => undefined;
  };
  const context: Partial<MainContext> = { files, job: jobs.job, jobs: { start: jobs.job, list: jobs.list, cancel: () => undefined, dismiss: () => undefined }, emit, onOpen };
  return { ctx: context as MainContext, emit, openHandlers };
};

const setup = (grant: () => object = () => grantFor(1)) => {
  const files = memoryFiles();
  const jobs = fakeJobs();
  const { ctx, emit, openHandlers } = contextOf(files, jobs);
  const installed: string[] = [];
  const installer: CatalogInstaller = {
    install: async ({ file, grant: answered }) => {
      expect(await readFile(file)).toEqual(Buffer.from(ITEM));
      installed.push(`${answered.label} ${answered.version}`);
      return { installedName: `starter-${answered.version}` };
    },
    uninstall: vi.fn((record: InstalledRecord, store: FileStore) => store.remove(`packs/${record.installedName}`)),
  };
  const onRelease = vi.fn(() => 2);
  const fetch = fetchStub(grant);
  vi.stubGlobal('fetch', fetch);
  const config: CatalogConfig = {
    label: 'Library', endpoint: { baseUrl: 'https://api.example.com', fetch }, installers: { zip: installer }, onRelease,
    schema: { item: (value) => value as { id: string }, page: (value) => value as { items: { id: string }[]; nextCursor: null } },
  };
  return { catalog: configureCatalog(ctx, config), config, files, jobs, emit, installer, installed, onRelease, openHandlers };
};

export { ITEM, SHA, grantFor, setup };
