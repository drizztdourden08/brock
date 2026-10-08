/* @layer electron-main @kind logic */
import { rm } from 'fs/promises';
import { join } from 'path';
import { formatBytes } from '@drizztdourden08/brock-core/format';
import type { JobHandle } from '@drizztdourden08/brock-electron/main';
import type { ToolDef, ToolLocation } from '../tools.type';
import type { InstallPlan, ToolsEnv } from './tools-main.type';
import { INSTALL_STEPS } from './tools-main.constants';
import { downloadFile } from './download-file';
import { downloadFor } from './download-for';
import { extractBinaries } from './extract-binaries';
import { verifyDownload } from './verify-download';

const fetchAndUnpack = async (job: JobHandle, plan: InstallPlan, archive: string, env: ToolsEnv): Promise<ToolLocation> => {
  const { def, download } = plan;
  job.step('download', `Downloading ${def.label}`);
  await downloadFile(download.url, archive, {
    fetch: env.fetch,
    signal: job.signal,
    onProgress: (received, total) => {
      if (total) job.progress(received / total, `${formatBytes(received)} of ${formatBytes(total)}`);
    },
  });
  job.step('verify', 'Checking the checksum');
  const verified = await verifyDownload(archive, download);
  if (!verified.success) throw new Error(verified.error);
  job.step('extract', `Unpacking ${def.label}`);
  return { source: 'cache', paths: await extractBinaries(archive, plan) };
};

const installTool = async (def: ToolDef, cacheDir: string, env: ToolsEnv): Promise<ToolLocation> => {
  const download = await downloadFor(def, env.platform);
  if (!download) throw new Error(def.installHint ?? `${def.label} has no download for this system`);
  const plan: InstallPlan = { def, download, cacheDir, platform: env.os };
  const archive = join(env.tempDir, `${def.id}-${Date.now()}.download`);
  const job = env.job(`tool:${def.id}`, INSTALL_STEPS, { title: `Installing ${def.label}` });
  try {
    return await job.run((handle) => fetchAndUnpack(handle, plan, archive, env));
  } finally {
    await rm(archive, { force: true });
  }
};

export { installTool };
