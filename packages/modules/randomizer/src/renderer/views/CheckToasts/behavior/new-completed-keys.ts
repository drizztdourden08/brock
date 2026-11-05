/* @layer renderer-shell @kind logic */
const newCompletedKeys = (known: ReadonlySet<string>, next: ReadonlySet<string>): string[] =>
  [...next].filter((key) => !known.has(key));

export { newCompletedKeys };
