/* @layer tooling-scripts @kind types */
import type { UserConfig } from 'vite';

declare const defineBrockWebConfig: (rootDir: string, overrides?: UserConfig) => Promise<UserConfig>;

export { defineBrockWebConfig };
