/* @layer electron-main @kind logic */
import type { ClassicTrack } from '../../classic-manifest';
import { synthesizeClassicManifest } from '../../classic-manifest';
import { readManifest } from '../../edit';
import { trackNumberOf } from '../../paths';
import type { MsuPackManifest } from '../../types';
import type { PackEnv } from '../pack-fs';
import { NO_MANIFEST } from './run.constants';

const classicTracksOf = (names: string[]): ClassicTrack[] =>
  names
    .map((fileName) => ({ fileName, trackNum: trackNumberOf(fileName) }))
    .filter((track): track is ClassicTrack => track.trackNum !== null);

const manifestToEdit = async (env: PackEnv, pack: string, names: string[]): Promise<MsuPackManifest> => {
  const existing = await readManifest(env.game, env.files, pack);
  if (existing !== null) return existing;
  const tracks = classicTracksOf(names);
  if (tracks.length === 0) throw new Error(NO_MANIFEST);
  return synthesizeClassicManifest(env.game, pack, tracks);
};

export { manifestToEdit };
