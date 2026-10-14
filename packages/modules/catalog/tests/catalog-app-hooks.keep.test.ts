/* @layer core @kind test */
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { JobSnapshot } from '@drizztdourden08/brock-core/types';
import { installBarProps } from '../src/compounds/CatalogInstallBar/behavior/install-bar-props';
import { catalogJobId } from '../src/jobs/catalog-job-id';
import { isCatalogInstalling } from '../src/jobs/is-catalog-installing';
import { readInstalledRecords } from '../src/main/read-installed-records';
import { setup } from './catalog-sim/catalog-setup';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('what app code reads of an install', () => {
  it('sends what an installer removes to the trash, unless the app asks to delete', async () => {
    const trashing = setup();
    await trashing.catalog.install({ itemId: 'abc', version: null });
    await trashing.catalog.uninstall('abc');
    expect(trashing.files.trashed).toEqual(['packs/starter-1']);
    const deleting = setup();
    deleting.catalog.configure({ ...deleting.config, removeTo: 'delete' });
    await deleting.catalog.install({ itemId: 'abc', version: null });
    await deleting.catalog.uninstall('abc');
    expect(deleting.files.trashed).toEqual([]);
    expect(deleting.installer.uninstall).toHaveBeenCalledOnce();
  });

  it('tells app code an item is installing from the job list, with or without the context', async () => {
    const { catalog, jobs } = setup();
    const install = catalog.install({ itemId: 'abc', version: null });
    const seen = [isCatalogInstalling('abc', jobs.list()), isCatalogInstalling('abc', { list: jobs.list }), isCatalogInstalling('other', jobs.list())];
    await install;
    expect(seen).toEqual([true, true, false]);
    expect(isCatalogInstalling('abc', jobs.list())).toBe(false);
    expect(catalogJobId('abc')).toBe('catalog-install:abc');
  });

  it('reads the installed records with no context, from a file store or a folder on disk', async () => {
    const { catalog, files } = setup();
    await catalog.install({ itemId: 'abc', version: null });
    expect((await readInstalledRecords(files)).map((record) => record.itemId)).toEqual(['abc']);
    const root = await mkdtemp(join(tmpdir(), 'brock-catalog-read-'));
    try {
      await mkdir(join(root, 'catalog'));
      await writeFile(join(root, 'catalog', 'installed.json'), files.data.get('catalog/installed.json') ?? '');
      expect(await readInstalledRecords(root)).toHaveLength(1);
      expect(await readInstalledRecords(join(root, 'catalog', 'installed.json'))).toHaveLength(1);
      expect(await readInstalledRecords(join(root, 'missing'))).toEqual([]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('hides Cancel on the install bar once the job can no longer be cancelled', () => {
    const state = { record: null, running: true, hasUpdate: false, error: null, signedOut: false, install: vi.fn(), uninstall: vi.fn(), cancel: vi.fn() };
    const job = (cancellable: boolean) => ({ id: 'catalog-install:abc', state: 'running', progress: 0.5, line: null, cancellable }) as JobSnapshot;
    expect(installBarProps({ ...state, job: job(true) }).onCancel).toBe(state.cancel);
    expect(installBarProps({ ...state, job: job(false) }).onCancel).toBeUndefined();
  });
});
