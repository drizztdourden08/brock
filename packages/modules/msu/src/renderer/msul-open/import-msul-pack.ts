/* @layer renderer-shell @kind logic */
import { getAppLog } from '@drizztdourden08/brock-react';
import { msuApi } from '../msu-api';
import type { MsulInstaller } from './msul-open.type';

const LOG_CHANNEL = 'msu';

const stemOf = (filePath: string): string =>
  (filePath.split(/[\\/]/).pop() ?? '').replace(/\.msul$/i, '');

const importMsulPack = async (installer: MsulInstaller, filePath: string): Promise<void> => {
  const log = getAppLog();
  log.log(LOG_CHANNEL, `Opening pack file ${filePath}`);
  try {
    const api = msuApi();
    if (api === null) throw new Error('window.api.msu is not installed: add the msu module to the preload.');
    const buffer = await api.readMsul(filePath);
    const result = await installer.installMsulFile(new Uint8Array(buffer), stemOf(filePath));
    log.log(LOG_CHANNEL, `Imported "${result.pack}" with ${result.fileCount} files and ${result.trackCount} slots`);
  } catch (err) {
    log.error(`[MSU] Could not import that pack: ${err instanceof Error ? err.message : String(err)}`);
  }
};

export { importMsulPack };
