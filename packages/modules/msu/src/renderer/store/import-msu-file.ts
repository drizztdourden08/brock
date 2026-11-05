/* @layer renderer-shell @kind logic */
import { installMsuTracks } from './install-msu-tracks';
import type { MsuResult, MsuStoreEnv } from './msu-store.type';

const importMsuFile = (env: MsuStoreEnv) => (pack: string, file: File): Promise<MsuResult> =>
  installMsuTracks(env, pack, async () => ({ bytes: new Uint8Array(await file.arrayBuffer()), name: file.name }));

export { importMsuFile };
