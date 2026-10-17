/* @layer renderer-shell @kind logic */
import type { ScrollMark } from './screen-scroll.type';

const pathOf = (root: Element, el: Element): number[] => {
  const path: number[] = [];
  for (let at: Element | null = el; at !== null && at !== root; at = at.parentElement) {
    const parent: Element | null = at.parentElement;
    if (parent === null) return [];
    path.unshift(Array.prototype.indexOf.call(parent.children, at));
  }
  return path;
};

const elementAt = (root: Element, path: readonly number[]): Element | null =>
  path.reduce<Element | null>((at, index) => at?.children.item(index) ?? null, root);

const readMarks = (root: Element): ScrollMark[] =>
  [root, ...root.querySelectorAll('*')]
    .filter((el) => el.scrollTop > 0 || el.scrollLeft > 0)
    .map((el) => ({ path: pathOf(root, el), top: el.scrollTop, left: el.scrollLeft }));

const fits = (el: Element, mark: ScrollMark): boolean =>
  el.scrollHeight - el.clientHeight >= mark.top - 1 && el.scrollWidth - el.clientWidth >= mark.left - 1;

const applyMarks = (root: Element, marks: readonly ScrollMark[], force: boolean): ScrollMark[] =>
  marks.filter((mark) => {
    const el = elementAt(root, mark.path);
    if (el === null || (!force && !fits(el, mark))) return true;
    el.scrollTop = mark.top;
    el.scrollLeft = mark.left;
    return false;
  });

const scrollMarks = { read: readMarks, apply: applyMarks };

export { scrollMarks };
