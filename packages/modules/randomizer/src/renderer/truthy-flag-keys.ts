/* @layer renderer-shell @kind logic */
const truthyFlagKeys = (flags: Readonly<Record<string, unknown>>): Set<string> =>
  new Set(Object.keys(flags).filter((key) => Boolean(flags[key])));

export { truthyFlagKeys };
