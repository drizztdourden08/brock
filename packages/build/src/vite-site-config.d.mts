/* @layer tooling-scripts @kind types */
import type { UserConfig } from 'vite';

declare const defineBrockSiteConfig: (siteDir: string, overrides?: UserConfig) => Promise<UserConfig>;

export { defineBrockSiteConfig };
