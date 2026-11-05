/* @layer renderer-shell @kind logic */
import type { MsuGameConfig } from '../../../../config';
import { effectivePackManifest } from '../../../../classic-manifest';
import type { MsuPackManifest } from '../../../../types';
import type { TrackInfo } from '../../msu.type';

const effectiveManifest = (
  config: MsuGameConfig, pack: string, manifest: MsuPackManifest | null, trackInfos: TrackInfo[],
): MsuPackManifest =>
  effectivePackManifest(config, pack, manifest, trackInfos.map((t) => ({ fileName: t.fileName, trackNum: t.trackNum })));

export { effectiveManifest };
