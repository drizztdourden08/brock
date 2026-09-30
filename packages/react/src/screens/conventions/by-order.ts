/* @layer renderer-shell @kind logic */
const byOrder = <T extends { order: number; label: string }>(a: T, b: T): number =>
  a.order === b.order ? a.label.localeCompare(b.label) : a.order - b.order;

export { byOrder };
