/* @layer renderer-shell @kind types */
import type { MsuEngine, MsuPackManifest } from '../../../types';
import type { PreviewReport } from '../../preview-report';

type ReadReport<Ctx = unknown> = (engine: MsuEngine<Ctx>) => PreviewReport | null;

interface PreviewRun<Ctx = unknown> {
  manifest: MsuPackManifest;
  read: ReadReport<Ctx>;
  begin: (engine: MsuEngine<Ctx>) => void;
}

interface PreviewSession<Ctx = unknown> {
  ctx: AudioContext;
  engine: MsuEngine<Ctx>;
  read: ReadReport<Ctx>;
}

export type { PreviewRun, PreviewSession };
