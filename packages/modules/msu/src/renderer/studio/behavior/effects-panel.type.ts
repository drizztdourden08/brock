/* @layer renderer-shell @kind types */
import type { SoundPanelController } from '../msu.type';

type EffectRow = { channel: string; row: SoundPanelController['rows'][number] };

type OpenEffect = { channel: string; soundId: number };

type EffectsSummary = {
  replaced: number;
  total: number;
  sounding: boolean;
  status: string | null;
  statusOk: boolean;
};

export type { EffectRow, EffectsSummary, OpenEffect };
