/* @layer renderer-shell @kind logic */
import type { MsuPackManifest } from '../../../../types';
import { withTrackFiles } from './with-track-files';

const withTrackFile = (
  manifest: MsuPackManifest, trackNum: number, fileName: string | null, layerName: string,
): MsuPackManifest => withTrackFiles(manifest, trackNum, fileName ? [fileName] : [], layerName);

export { withTrackFile };
