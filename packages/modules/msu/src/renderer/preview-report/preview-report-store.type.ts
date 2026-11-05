/* @layer renderer-shell @kind types */
import type { MsuLayerReport } from '../../types';
import type { createPreviewReportStore } from './preview-report-store';

interface PreviewReport {
  key: string;
  elapsedSeconds: number;
  layers: MsuLayerReport[];
  detail: string | null;
}

type ReportedVoice = MsuLayerReport['voices'][number];

type Listener = () => void;

type PreviewReportStore = ReturnType<typeof createPreviewReportStore>;

export type { PreviewReport, ReportedVoice, Listener, PreviewReportStore };
