/* @layer core @kind types */
import type { MsuGameConfig, MsuHost } from '../config';
import type { LoadBytes } from '../player/track-loader';
import type { MsuEngine, MsuPackManifest } from '../types';

interface MsuSessionLog {
  info: (message: string) => void;
  error: (message: string) => void;
}

interface MsuSessionOptions<Ctx = unknown> {
  config: MsuGameConfig<Ctx>;
  host: MsuHost;
  manifest: MsuPackManifest;
  loadBytes: LoadBytes;
  variant?: string;
  musicVolume: () => number;
  sfxVolume: () => number;
  ambientVolume: () => number;
  resumeEnabled: () => boolean;
  resetAtTitle: () => boolean;
  replaceAmbient: boolean;
  replaceSfx: boolean;
  log?: MsuSessionLog;
}

interface MsuSessionTeardown {
  host: MsuHost;
  config: MsuGameConfig<never>;
}

type MsuSessionState = {
  engine: MsuEngine<never> | null;
  owner: object | null;
  pending: (() => boolean) | null;
  pollId: ReturnType<typeof setInterval> | null;
  teardown: MsuSessionTeardown | null;
};

export type { MsuSessionLog, MsuSessionOptions, MsuSessionState };
