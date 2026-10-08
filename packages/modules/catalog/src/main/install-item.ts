/* @layer electron-main @kind logic */
import type { JobHandle } from '@drizztdourden08/brock-electron/main';
import { CATALOG_JOB_PREFIX } from '../catalog.constants';
import type { CatalogGrant, CatalogLink, InstalledRecord } from '../catalog.type';
import { checkGrant } from './check-grant';
import type { CatalogInstaller, InstallOutcome } from './catalog-config.type';
import { INSTALL_STEPS } from './catalog-main.constants';
import { downloadToFile } from './download-to-file';
import type { InstallDeps } from './install-item.type';
import { isInstalling } from './is-installing';
import { retireRecord } from './retire-record';
import { verifyDownload } from './verify-download';

const recordOf = (grant: CatalogGrant, installedName: string): InstalledRecord => ({
  itemId: grant.itemId,
  version: grant.version,
  label: grant.label,
  container: grant.container,
  kind: grant.kind ?? null,
  installedName,
  installedAt: Date.now(),
  meta: grant.meta ?? {},
});

const fetchVerified = async (grant: CatalogGrant, job: JobHandle) => {
  job.step('download');
  const downloaded = await downloadToFile(grant.url, { signal: job.signal, onProgress: (done) => job.progress(done / grant.bytes) });
  job.step('verify');
  try {
    verifyDownload(grant, downloaded);
  } catch (error) {
    await downloaded.dispose();
    throw error;
  }
  return downloaded;
};

const settledName = async (deps: InstallDeps, installer: CatalogInstaller, record: InstalledRecord, outcome: InstallOutcome): Promise<string> => {
  if (!installer.settleName || !outcome.ownName || outcome.ownName === record.installedName) return record.installedName;
  const settled = await installer.settleName(record.installedName, outcome.ownName, deps.ctx.files);
  if (settled !== record.installedName) await deps.config.onRelease?.(record, settled, deps.ctx);
  return settled;
};

const unpack = async (deps: InstallDeps, grant: CatalogGrant, file: string, job: JobHandle): Promise<InstalledRecord> => {
  job.step('unpack');
  const installer = deps.config.installers[grant.container];
  if (!installer) throw new Error(`No installer for ${grant.container}.`);
  const previous = await deps.registry.get(grant.itemId);
  const outcome = await installer.install({ file, grant, files: deps.ctx.files, report: (done, total) => job.progress(total ? done / total : 0) });
  if (previous && previous.installedName !== outcome.installedName) await retireRecord(deps, previous, outcome.installedName);
  const installed = recordOf(grant, outcome.installedName);
  const record = { ...installed, installedName: await settledName(deps, installer, installed, outcome) };
  await deps.registry.put(record);
  await deps.config.onInstalled?.(record, deps.ctx);
  return record;
};

const cancelled = (): Error => Object.assign(new Error('The install was cancelled.'), { name: 'AbortError' });

const installWork = (deps: InstallDeps, link: CatalogLink) => async (job: JobHandle): Promise<InstalledRecord> => {
  job.step('grant');
  const grant = await deps.reads.grant(link.itemId, link.version);
  checkGrant(grant, link.itemId, deps.config);
  const downloaded = await fetchVerified(grant, job);
  try {
    if (job.signal.aborted) throw cancelled();
    return await unpack(deps, grant, downloaded.file, job);
  } finally {
    await downloaded.dispose();
  }
};

const installItem = (deps: InstallDeps, link: CatalogLink): Promise<InstalledRecord> => {
  if (isInstalling(deps.ctx, link.itemId)) throw new Error('This item is already installing.');
  const job = deps.ctx.job(`${CATALOG_JOB_PREFIX}${link.itemId}`, INSTALL_STEPS, { title: `${deps.config.label}: installing`, cancellable: true });
  return job.run(installWork(deps, link));
};

export { installItem };
