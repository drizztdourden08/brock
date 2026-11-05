/* @layer renderer-shell @kind logic */
import { isZip, unzip } from '../../archive';
import { packDir } from '../../paths';
import type { ImportReport } from './import-job/import-job.type';
import { MSU_TRACK_PATTERN, NO_TRACKS_ERROR } from './msu-store.constants';
import type { MsuResult, MsuStoreEnv, MsuTrackEntry, MsuTrackSource } from './msu-store.type';

const resolveTracks = async (bytes: Uint8Array, name: string): Promise<MsuTrackEntry[]> => {
  if (isZip(bytes)) return (await unzip(bytes)).filter((e) => MSU_TRACK_PATTERN.test(e.name));
  return MSU_TRACK_PATTERN.test(name) ? [{ name, bytes }] : [];
};

const install = async (env: MsuStoreEnv, pack: string, tracks: MsuTrackEntry[], report: ImportReport): Promise<MsuResult> => {
  if (tracks.length === 0) return { success: false, error: NO_TRACKS_ERROR };
  let copied = 0;
  for (const t of tracks) {
    await env.files.writeBytes(`${packDir(env.game.config, pack)}/${t.name}`, t.bytes);
    copied += 1;
    report.count('copy', copied, tracks.length);
  }
  return { success: true, fileCount: tracks.length };
};

const failureOf = (result: MsuResult): string | null => (result.success ? null : (result.error ?? null));

const errorMessage = (err: unknown): string => (err instanceof Error ? err.message : String(err));

const installMsuTracks = async (env: MsuStoreEnv, pack: string, read: MsuTrackSource): Promise<MsuResult> => {
  try {
    return await env.runJob({
      kind: 'msu',
      title: 'Importing a music pack',
      work: async (report) => {
        const { bytes, name } = await read(report);
        return install(env, pack, await resolveTracks(bytes, name), report);
      },
      failureOf,
    });
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
};

export { installMsuTracks };
