/* @layer core @kind logic */
import type { MsuGameConfig } from '../config';

const packDir = (config: MsuGameConfig, pack: string): string => `${config.packRoot}/${pack}`;

export { packDir };
