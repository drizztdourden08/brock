/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { MsuPackManifest } from '../../../types';
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import { formatBytes } from '@drizztdourden08/brock-core';
import { useMsuStudioGame } from '../../game/useMsuStudioGame';
import { extensionOf } from './track-file-name';
import type { MatchedTrack, MsuFile } from '../msu.type';

const fileEntriesOf = (manifest: MsuPackManifest) =>
  manifest.tracks.flatMap((t) => t.layers.flatMap((l) => l.files.map((f) => ({ trackNum: t.trackNum, ext: extensionOf(f) }))));

const useTrackRows = (manifest: MsuPackManifest, files: MsuFile[]) => {
  const game = useMsuStudioGame<never, never>();
  const byTrack = useMemo(() => new Map(manifest.tracks.map((t) => [t.trackNum, t])), [manifest]);

  const entries = useMemo(() => fileEntriesOf(manifest), [manifest]);

  const extended = useMemo(() => entries.some((entry) => entry.trackNum >= game.extendedThreshold), [entries, game]);

  const hasOpuz = useMemo(() => entries.some((entry) => entry.ext === 'opuz'), [entries]);

  const rows = useMemo((): MatchedTrack[] => {
    const numbers = new Set<number>();
    for (let trackNum = 1; trackNum <= game.baseTrackCount; trackNum += 1) numbers.add(trackNum);
    if (extended) for (const trackNum of game.extendedTracks) numbers.add(trackNum);
    return [...numbers].sort((a, b) => a - b).map((trackNum) => {
      const layers = byTrack.get(trackNum)?.layers ?? [];
      return {
        trackNum,
        description: game.trackName(trackNum),
        fileName: layers[0]?.files[0] ?? null,
        layerCount: layers.length,
      };
    });
  }, [byTrack, extended, game]);

  const referenced = useMemo(
    () => new Set(manifest.tracks.flatMap((t) => t.layers.flatMap((l) => l.files))),
    [manifest],
  );

  const unusedFiles = useMemo(() => files.filter((f) => !referenced.has(f.name)), [files, referenced]);

  const fileOptions = useMemo((): SelectOption[] => [
    { value: '', label: '(none)' },
    ...files.map((f) => ({ value: f.name, label: f.name, description: formatBytes(f.size) })),
  ], [files]);

  return { rows, unusedFiles, fileOptions, isDeluxe: extended, hasOpuz };
};

export { useTrackRows };
