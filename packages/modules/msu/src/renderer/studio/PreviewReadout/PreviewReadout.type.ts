/* @layer renderer-shell @kind types */
import type { MsuLayerReport } from '../../../types';
import type { PreviewReportStore } from '../../preview-report';

type ReportedVoice = MsuLayerReport['voices'][number];

type LayerMeterKind = 'voice' | 'next';

interface FadeMeter {
  kind: 'in' | 'out';
  fill: number;
  label: string;
}

interface LayerMeterRow {
  id: string;
  kind: LayerMeterKind;
  caption: string;
  title: string | null;
  fill: number | null;
  label: string;
  fade: FadeMeter | null;
  introFill?: number | null;
}

interface LayerMeters {
  voices: LayerMeterRow[];
  next: LayerMeterRow | null;
}

interface MeterRowProps {
  row: LayerMeterRow;
}

interface FadeChipProps {
  fade: FadeMeter;
}

interface LayerMeterProps {
  report: MsuLayerReport;
  showName?: boolean;
}

interface PreviewReadoutProps {
  store: PreviewReportStore;
  previewKey: string;
  label: string;
}

interface LayerLiveProps {
  store: PreviewReportStore;
  previewKey: string;
  layerId: string;
}

interface VoiceCaption {
  caption: string;
  title: string | null;
}

export type {
  ReportedVoice,
  FadeMeter,
  LayerMeterRow,
  LayerMeters,
  MeterRowProps,
  FadeChipProps,
  LayerMeterProps,
  PreviewReadoutProps,
  LayerLiveProps,
  VoiceCaption,
};
