/* @layer renderer-shell @kind logic */
import type { MsuLayerReport } from '../../types';
import { SECONDS, TENTHS } from './preview-report-store.constants';
import type { Listener, PreviewReport, ReportedVoice } from './preview-report-store.type';

const at = (value: number | null, precision: number): string =>
  value === null ? '-' : String(Math.round(value / precision));

const voiceSignature = (voice: ReportedVoice): string => [
  voice.fileName ?? '-',
  at(voice.positionSeconds, TENTHS),
  at(voice.durationSeconds, SECONDS),
  voice.fade === null ? '-' : `${voice.fade.kind}${at(voice.fade.remainingSeconds, TENTHS)}`,
].join(',');

const layerSignature = (layer: MsuLayerReport): string => [
  layer.layerId,
  layer.sounding ? '1' : '0',
  layer.fileName ?? '-',
  at(layer.nextEventInSeconds, TENTHS),
  at(layer.waitSeconds, TENTHS),
  String(layer.voiceCount),
  layer.voices.map(voiceSignature).join('/'),
].join('|');

const signatureOf = (report: PreviewReport | null): string =>
  report === null
    ? ''
    : [
      report.key,
      at(report.elapsedSeconds, TENTHS),
      report.detail ?? '-',
      report.layers.map(layerSignature).join(';'),
    ].join('#');

const createPreviewReportStore = () => {
  const listeners = new Set<Listener>();
  let snapshot: PreviewReport | null = null;
  let signature = signatureOf(null);

  const subscribe = (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  };

  const getSnapshot = (): PreviewReport | null => snapshot;

  const publish = (next: PreviewReport | null): void => {
    const nextSignature = signatureOf(next);
    if (nextSignature === signature) return;
    signature = nextSignature;
    snapshot = next;
    listeners.forEach((listener) => listener());
  };

  return { subscribe, getSnapshot, publish };
};

export { createPreviewReportStore };
