/* @layer renderer-shell @kind logic */

const dialogExtensions = (accept: readonly string[] | undefined): string[] =>
  (accept ?? []).map((ending) => ending.replace(/^\*?\./, '')).filter((ending) => ending.length > 0);

export { dialogExtensions };
