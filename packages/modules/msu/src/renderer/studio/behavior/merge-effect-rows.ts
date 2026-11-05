/* @layer renderer-shell @kind logic */
import type { SoundRowData } from '../msu.type';
import type { EffectRow } from './effects-panel.type';

const mergeEffectRows = (
  channels: readonly [string, string],
  firstRows: SoundRowData[],
  secondRows: SoundRowData[],
  wanted: string | null,
): EffectRow[] => {
  const [first, second] = channels;
  return [
    ...(wanted === second ? [] : firstRows.map((row) => ({ channel: first, row }))),
    ...(wanted === first ? [] : secondRows.map((row) => ({ channel: second, row }))),
  ].sort((a, b) => a.row.soundId - b.row.soundId || a.channel.localeCompare(b.channel));
};

export { mergeEffectRows };
