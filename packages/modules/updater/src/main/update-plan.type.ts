/* @layer electron-main @kind types */
import type { VelopackAsset } from 'velopack';
import type { VersionOption } from '../updater.type';

interface UpdatePlan {
  target: VelopackAsset;
  base?: VelopackAsset;
  deltas: VelopackAsset[];
  downloadSize: number;
}

interface AssetTables {
  full: ReadonlyMap<string, VelopackAsset>;
  delta: ReadonlyMap<string, VelopackAsset>;
}

interface PlanInput extends AssetTables {
  target: string;
  current: string;
}

interface VersionCandidate extends VersionOption {
  plan: UpdatePlan;
}

export type { UpdatePlan, AssetTables, PlanInput, VersionCandidate };
