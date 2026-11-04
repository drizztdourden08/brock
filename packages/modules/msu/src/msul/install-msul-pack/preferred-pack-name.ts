/* @layer core @kind logic */
const preferredPackName = (desired: string | undefined, fallback: string): string =>
  (desired === undefined || desired === '' ? fallback : desired);

export { preferredPackName };
