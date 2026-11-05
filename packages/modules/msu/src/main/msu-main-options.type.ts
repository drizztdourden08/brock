/* @layer electron-main @kind types */
import type { MsuGameConfig } from '../config';

type PackWriteRefusal = (packName: string) => string | null | Promise<string | null>;

interface MsuMainOptions {
  game: MsuGameConfig;
  toolId?: string;
  registerTool?: boolean;
  refuseWrite?: PackWriteRefusal;
}

interface ResolvedMsuMainOptions {
  game: MsuGameConfig;
  toolId: string;
  refuseWrite: PackWriteRefusal | undefined;
}

export type { MsuMainOptions, PackWriteRefusal, ResolvedMsuMainOptions };
