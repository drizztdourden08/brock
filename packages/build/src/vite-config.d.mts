/* @layer tooling-scripts @kind types */
import type { UserConfig } from 'electron-vite';

declare const defineBrockViteConfig: (rootDir: string, overrides?: UserConfig) => UserConfig;
declare const sourceDependencies: (rootDir: string) => string[];

export { defineBrockViteConfig, sourceDependencies };
