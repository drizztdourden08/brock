/* @layer core @kind logic */
import type { MsuGameConfig } from '../config';
import type { MsuPackManifest } from '../types';

const packGameMismatch = (config: MsuGameConfig, manifest: MsuPackManifest | null): string | null => {
  const game = manifest?.meta.game;
  if (game === undefined || game === '' || game === config.id) return null;
  return `This pack is made for ${game}, not for ${config.id}.`;
};

export { packGameMismatch };
