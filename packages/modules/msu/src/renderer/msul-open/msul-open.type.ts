/* @layer renderer-shell @kind types */
import type { MsuStore } from '../store/msu-store.type';

interface MsulInstalled {
  pack: string;
  fileCount: number;
  trackCount: number;
}

type MsulInstaller = Pick<MsuStore, 'installMsulFile'>;

export type { MsulInstalled, MsulInstaller };
