/* @layer core @kind types */
import type { effectivePackManifest } from '../classic-manifest';
import type { MsuGameConfig } from '../config';

type PackSessionInput<Ctx = unknown> = {
  packName: string;
  manifest: Parameters<typeof effectivePackManifest>[1];
  tracks: Parameters<typeof effectivePackManifest>[2];
  variant?: string;
  config: MsuGameConfig<Ctx>;
};

export type { PackSessionInput };
