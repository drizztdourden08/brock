/* @layer core @kind types */
interface MsuTrackUpload {
  name: string;
  bytes: Uint8Array;
}

interface TrackFileRename {
  from: string;
  to: string;
}

export type { MsuTrackUpload, TrackFileRename };
