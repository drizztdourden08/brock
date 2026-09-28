/* @layer tooling-scripts @kind types */
import type { BrockConfig } from './config.d.mts';

declare const loadBrockConfig: (rootDir: string) => Promise<BrockConfig>;

export { loadBrockConfig };
