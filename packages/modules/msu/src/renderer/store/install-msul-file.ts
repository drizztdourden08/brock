/* @layer renderer-shell @kind logic */
import { installMsulPack } from '../../msul';
import type { InstallResult } from '../../msul';
import type { MsuStoreEnv } from './msu-store.type';

const installMsulFile = ({ game, files, runJob }: MsuStoreEnv) => (bytes: Uint8Array, desiredName?: string): Promise<InstallResult> =>
  runJob({
    kind: 'msu',
    title: 'Importing a music pack',
    work: (report) => installMsulPack(game.config, files, bytes, {
      desiredName,
      onProgress: (done, total) => report.count('copy', done, total),
    }),
  });

export { installMsulFile };
