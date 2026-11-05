/* @layer renderer-shell @kind types */
import type { useFilePanelModel } from './behavior/useFilePanelModel';

type FilesSummaryProps = {
  model: ReturnType<typeof useFilePanelModel>;
  readOnly: boolean;
  onOptimize: () => void;
};

export type { FilesSummaryProps };
