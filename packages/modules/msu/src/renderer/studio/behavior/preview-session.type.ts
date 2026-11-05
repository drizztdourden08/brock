/* @layer renderer-shell @kind types */
import type { MsuEngine, MsuPackManifest } from '../../../types';
import type { PreviewReport } from '../../preview-report';

type ReadReport = (engine: MsuEngine<never>) => PreviewReport | null;

interface PreviewRun {
  manifest: MsuPackManifest;
  read: ReadReport;
  begin: (engine: MsuEngine<never>) => void;
}

interface PreviewSession {
  ctx: AudioContext;
  engine: MsuEngine<never>;
  read: ReadReport;
}

export type { PreviewRun, PreviewSession };
