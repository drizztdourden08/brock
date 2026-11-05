/* @layer renderer-shell @kind logic */
import type { SoundRowData } from '../msu.type';

const soundRowMatches = (row: SoundRowData, query: string): boolean =>
  row.hex.toLowerCase().includes(query)
  || String(row.soundId).includes(query)
  || (row.label ?? '').toLowerCase().includes(query)
  || row.triggers.some((trigger) => trigger.toLowerCase().includes(query));

export { soundRowMatches };
