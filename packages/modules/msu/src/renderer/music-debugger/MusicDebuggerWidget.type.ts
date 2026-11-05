/* @layer renderer-shell @kind types */
import type { PreviewReportStore } from '../preview-report';

interface LiveChannel {
  name: string;
  title: string;
  slots: number;
  store: PreviewReportStore;
}

interface LayerSlotView {
  empty: boolean;
  sounding: boolean;
  name: string;
  mode: string;
  fill: number;
  label: string;
  flag: string;
  title: string;
}

export type { LayerSlotView, LiveChannel };
