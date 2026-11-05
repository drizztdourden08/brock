/* @layer renderer-shell @kind logic */
import type { LoadBytes } from '../../../player/track-loader';
import type { MsuStore } from '../../store/msu-store.type';

const previewLoader = (store: MsuStore, pack: string): LoadBytes => async (fileName) => {
  try { return new Uint8Array(await store.readMsuTrackFile(pack, fileName)); } catch { return null; }
};

export { previewLoader };
