/* @layer renderer-shell @kind logic */
import type { KeptUsable } from '../TourHost.type';

const pathUp = (node: Element, scope: Element): Element[] => {
  const path: Element[] = [node];
  for (let at = node.parentElement; at && path.at(-1) !== scope; at = at.parentElement) path.push(at);
  return path;
};

const topInert = (node: Element, body: Element): HTMLElement | null => {
  let top: HTMLElement | null = null;
  for (let at: Element | null = node; at && at !== body; at = at.parentElement) {
    if (at instanceof HTMLElement && at.inert) top = at;
  }
  return top;
};

const inertAround = (keep: readonly Element[], scope: Element, made: HTMLElement[]): void => {
  const paths = keep.map((node) => pathUp(node, scope));
  const onPath = new Set(paths.flat());
  for (const parent of new Set(paths.flatMap((path) => path.slice(1)))) {
    for (const child of parent.children) {
      if (onPath.has(child) || !(child instanceof HTMLElement) || child.inert) continue;
      child.inert = true;
      made.push(child);
    }
  }
};

const keepUsable = (keep: readonly Element[], body: Element): KeptUsable => {
  const made: HTMLElement[] = [];
  const lifted = new Map<HTMLElement, Element[]>();
  for (const node of keep) {
    const top = topInert(node, body);
    if (top) lifted.set(top, [...(lifted.get(top) ?? []), node]);
  }
  for (const [top, inside] of lifted) {
    top.inert = false;
    inertAround(inside, top, made);
  }
  return { made, lifted: [...lifted.keys()] };
};

const undoKept = (kept: KeptUsable, touched: ReadonlySet<Node> | null): void => {
  for (const node of kept.made) node.inert = false;
  for (const node of kept.lifted) {
    if (!touched?.has(node)) node.inert = touched !== null;
  }
};

const keptUsable = { keep: keepUsable, undo: undoKept };

export { keptUsable };
