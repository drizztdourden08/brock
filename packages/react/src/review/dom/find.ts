/* @layer renderer-shell @kind logic */
const find = (selector: string, root: ParentNode = document): HTMLElement | null =>
  root.querySelector<HTMLElement>(selector);

export { find };
