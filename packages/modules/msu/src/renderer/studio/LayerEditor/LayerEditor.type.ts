/* @layer renderer-shell @kind types */
import type { MsuPackManifest } from '../../../types';
import type { LayerTarget } from '../behavior/layer-target';
import type { PreviewReportStore } from '../../preview-report/preview-report-store.type';

type ConfirmRequest = (title: string, message: string, onConfirm: () => void) => void;

interface LayerEditorProps {
  pack: string;
  target: LayerTarget;
  manifest: MsuPackManifest;
  saveBase: MsuPackManifest;
  availableFiles: string[];
  isLayered: boolean;
  reportStore: PreviewReportStore;
  onConfirm: ConfirmRequest;
  onSaved: () => void;
  readOnly?: boolean;
}

export type { LayerEditorProps };
export type { ConfirmRequest };
