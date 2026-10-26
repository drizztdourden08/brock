/* @layer tooling-scripts @kind types */
interface BrockVitestConfig {
  esbuild?: Record<string, unknown>;
  resolve?: Record<string, unknown>;
  test?: Record<string, unknown>;
  [key: string]: unknown;
}

declare const defineBrockVitestConfig: (rootDir: string, overrides?: BrockVitestConfig) => Promise<BrockVitestConfig>;

export { defineBrockVitestConfig };
export type { BrockVitestConfig };
