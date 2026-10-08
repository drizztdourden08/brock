/* @layer tooling-scripts @kind types */
interface SiteApiInput {
  url?: string;
  portOffset?: number;
  path?: string;
  changeOrigin?: boolean;
  stripPath?: boolean;
}

interface BrockSiteInput {
  site: { id: string; name?: string; brand?: string };
  ports: { offset: number; base?: number };
  api?: string | SiteApiInput;
  build?: { nodePolyfills?: boolean | Record<string, unknown>; aliases?: Record<string, string> };
}

type SiteApiTarget = { url: string } | { portOffset: number };

interface BrockSite {
  site: { id: string; name: string; brand: string | null };
  ports: { offset: number; base: number | null };
  api: { path: string; target: SiteApiTarget; changeOrigin: boolean; stripPath: boolean } | null;
  build: { nodePolyfills: boolean | Record<string, unknown>; aliases: Record<string, string> };
}

declare const defineBrockSite: (input: BrockSiteInput) => BrockSite;

export { defineBrockSite };
export type { BrockSite, BrockSiteInput, SiteApiInput, SiteApiTarget };
