/* @layer renderer-shell @kind logic */
import { installMsuTracks } from './install-msu-tracks';
import { nameFromUrl } from './name-from-url';
import type { MsuResult, MsuStoreEnv } from './msu-store.type';

const importMsu = (env: MsuStoreEnv) => (pack: string, url: string): Promise<MsuResult> =>
  installMsuTracks(env, pack, async (report) => ({
    bytes: await env.fetchBytes(url, (loaded, total) => report.count('download', loaded, total ?? undefined)),
    name: nameFromUrl(url),
  }));

export { importMsu };
