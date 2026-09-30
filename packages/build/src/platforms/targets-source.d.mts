/* @layer tooling-scripts @kind types */
declare const readTargets: (source: string) => string[] | null;
declare const writeTargets: (source: string, targets: string[]) => string;

export { readTargets, writeTargets };
