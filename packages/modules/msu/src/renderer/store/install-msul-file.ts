/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { installMsulPack } from '../../msul';
import type { InstallResult } from '../../msul';
import type { MsuStoreEnv } from './msu-store.type';

const installMsulFile = ({ game, files, runJob }: MsuStoreEnv) => (bytes: Uint8Array, desiredName?: string): Promise<InstallResult> =>
  runJob({
    kind: 'msu',
    title: msg('msu:job.import'),
    work: (report) => installMsulPack(game.config, files, bytes, {
      desiredName,
      onProgress: (done, total) => report.count('copy', done, total),
    }),
  });

export { installMsulFile };
