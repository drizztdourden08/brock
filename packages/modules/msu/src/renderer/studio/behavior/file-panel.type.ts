/* @layer renderer-shell @kind types */
import type { MsuPackManifest } from '../../../types';
import type { ActionResult, MsuFile } from '../msu.type';

interface FilePanelParams {
  pack: string;
  files: MsuFile[];
  saveBase: MsuPackManifest | null;
  reload: () => void;
}

interface FormatCount {
  ext: string;
  count: number;
}

type FileMutationParams = Pick<FilePanelParams, 'pack' | 'saveBase' | 'reload'> & {
  taken: Set<string>;
  setStatus: (result: ActionResult) => void;
  setWorking: (working: boolean) => void;
};

export type { FileMutationParams, FilePanelParams, FormatCount };
