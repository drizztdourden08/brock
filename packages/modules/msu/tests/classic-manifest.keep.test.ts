/* @layer core @kind test */
import type { FileStore } from '@drizztdourden08/brock-core';
import { describe, expect, it } from 'vitest';
import { synthesizeClassicManifest } from '../src/classic-manifest';
import type { MsuGameConfig } from '../src/config';
import { getTrackList } from '../src/packs';
import { packGameMismatch } from '../src/packs/pack-game-mismatch';

const config: MsuGameConfig = {
  id: 'demo',
  packRoot: 'msu',
  soundChannels: [],
  soundIdCount: 32,
  trackLoops: (track) => track === 1,
  classifyMusic: () => ({ kind: 'ignore' }),
  resumePath: (profile, kind, id) => `${profile}/${kind}/${id}.json`,
};

const folderStore = (names: string[]): FileStore => ({
  list: () => Promise.resolve(names),
  readBytes: () => Promise.resolve(null),
  readText: () => Promise.resolve(null),
  writeBytes: () => Promise.resolve(undefined),
  writeText: () => Promise.resolve(undefined),
  remove: () => Promise.resolve(undefined),
  exists: () => Promise.resolve(true),
  mkdir: () => Promise.resolve(undefined),
  stat: () => Promise.resolve(null),
});

describe('classic folder manifest', { tags: ['critical'] }, () => {
  it('follows the config trackLoops for each track', async () => {
    const tracks = await getTrackList(config, folderStore(['x.msu', 'x-1.pcm', 'x-2.pcm']), 'x');
    const manifest = synthesizeClassicManifest(config, 'x', tracks);
    expect(manifest.tracks.map((t) => t.trackNum)).toEqual([1, 2]);
    expect(manifest.tracks[0]?.layers[0]?.mode).toEqual({ kind: 'loop', order: 'single' });
    expect(manifest.tracks[1]?.layers[0]?.mode).toEqual({ kind: 'once' });
  });

  it('reports a pack made for another game', () => {
    const meta = { name: 'x', createdAt: 0, modifiedAt: 0 };
    const other = { version: 1 as const, meta: { ...meta, game: 'other' }, tracks: [] };
    expect(packGameMismatch(config, other)).toContain('other');
    expect(packGameMismatch(config, { ...other, meta: { ...meta, game: 'demo' } })).toBeNull();
    expect(packGameMismatch(config, { ...other, meta })).toBeNull();
  });
});
