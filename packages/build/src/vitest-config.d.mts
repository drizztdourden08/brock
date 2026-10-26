/* @layer tooling-scripts @kind types */
interface BrockVitestConfig {
  esbuild?: Record<string, unknown>;
  resolve?: Record<string, unknown>;
  test?: Record<string, unknown>;
  [key: string]: unknown;
}

interface BrockVitestOptions {
  appDir?: string;
}

declare const defineBrockVitestConfig: (rootDir: string, overrides?: BrockVitestConfig, options?: BrockVitestOptions) => Promise<BrockVitestConfig>;

export { defineBrockVitestConfig };
export type { BrockVitestConfig, BrockVitestOptions };
