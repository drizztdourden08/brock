/* @layer tooling-scripts @kind types */
declare const expandTargets: (targets: string[]) => { platforms: string[]; unknown: string[] };

export { expandTargets };
