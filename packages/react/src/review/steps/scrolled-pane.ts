/* @layer renderer-shell @kind logic */
import type { HubDef, HubPage } from '../../hub/hub.type';
import { nav } from '../../navigation/nav';
import { find } from '../dom/find';
import { settle } from '../dom/settle';
import { REVIEW_SCROLL_PX, SELECTORS } from '../review.constants';

const inLayer = (): HTMLElement[] => {
  const layer = find(SELECTORS.layer);
  return layer ? [...layer.querySelectorAll<HTMLElement>('*')] : [];
};

const scrolls = (el: Element): boolean => {
  const { overflowY } = getComputedStyle(el);
  return (overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight - el.clientHeight > REVIEW_SCROLL_PX;
};

const scrollPane = (): number | null => {
  const el = inLayer().find(scrolls);
  if (!el) return null;
  el.scrollTop = REVIEW_SCROLL_PX;
  return el.scrollTop;
};

const scrollSomePage = async (hub: HubDef, pages: readonly HubPage[]): Promise<number | null> => {
  const here = scrollPane();
  if (here !== null) return here;
  for (const page of pages) {
    nav.open(hub.id, { section: page.id });
    await settle();
    const top = scrollPane();
    if (top !== null) return top;
  }
  return null;
};

const paneAt = (top: number): boolean => inLayer().some((el) => Math.abs(el.scrollTop - top) <= 1);

const scrolledPane = { scroll: scrollSomePage, at: paneAt };

export { scrolledPane };
