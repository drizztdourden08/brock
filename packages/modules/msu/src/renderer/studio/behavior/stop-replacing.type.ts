/* @layer renderer-shell @kind types */
import type { MsuPackManifest } from '../../../types';
import type { ActionResult } from '../msu.type';

interface StopReplacingParams {
  pack: string;
  channel: string;
  saveBase: MsuPackManifest;
  reload: () => void;
  setStatus: (status: ActionResult) => void;
}

export type { StopReplacingParams };
