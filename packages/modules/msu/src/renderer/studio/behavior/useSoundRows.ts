/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { MsuPackManifest } from '../../../types';
import { useMsuStudioGame } from '../../game/useMsuStudioGame';
import { soundDefsOfChannel } from './sound-manifest';
import { buildSoundRows } from './sound-row-data';
import { soundRowMatches } from './sound-row-matches';

const useSoundRows = (
  manifest: MsuPackManifest,
  channel: string,
  filter: string,
  includeUnreachable = false,
) => {
  const game = useMsuStudioGame<never, never>();
  const byId = useMemo(
    () => new Map(soundDefsOfChannel(manifest, channel).map((def) => [def.soundId, def])),
    [manifest, channel],
  );

  const all = useMemo(() => buildSoundRows(game, channel, byId), [game, channel, byId]);

  const listed = useMemo(
    () => (includeUnreachable
      ? all
      : all.filter((row) => !row.unreachable || row.layerCount > 0)),
    [all, includeUnreachable],
  );

  const ids = useMemo(() => listed.map((row) => row.soundId), [listed]);

  const rows = useMemo(() => {
    const query = filter.trim().toLowerCase();
    const kept = query.length > 0 ? listed.filter((row) => soundRowMatches(row, query)) : listed;
    return [...kept].sort((a, b) => Number(b.layerCount > 0) - Number(a.layerCount > 0));
  }, [listed, filter]);

  const replacedCount = useMemo(() => listed.filter((row) => row.layerCount > 0).length, [listed]);
  const raisedCount = useMemo(() => listed.filter((row) => row.sites > 0).length, [listed]);
  const reachableCount = useMemo(() => listed.filter((row) => !row.unreachable).length, [listed]);
  const unreachableCount = useMemo(() => all.filter((row) => row.unreachable).length, [all]);

  return {
    rows, ids, replacedCount, raisedCount, reachableCount, unreachableCount,
    total: listed.length, hiddenCount: all.length - listed.length,
  };
};

export { useSoundRows };
