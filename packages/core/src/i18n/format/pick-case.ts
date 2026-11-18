/* @layer core @kind logic */
const pick = <T>(cases: Readonly<Record<string, T>>, key: string): T | undefined =>
  Object.hasOwn(cases, key) ? cases[key] : undefined;

export { pick };
