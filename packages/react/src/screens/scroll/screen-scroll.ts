/* @layer renderer-shell @kind logic */
import { useNavigationStore } from '../../navigation/useNavigationStore';
import type { NavigationSnapshot } from '../../navigation/navigation.type';
import { RESTORE_FRAMES, SCREEN_ROOT_SELECTOR, SCROLL_MARK_ATTRIBUTE } from './screen-scroll.constants';
import type { ScrollMark } from './screen-scroll.type';
import { scrollMarks } from './scroll-marks';

const kept = new Map<string, ScrollMark[]>();

const rootOf = (id: string): Element | null => {
  const mark = [...document.querySelectorAll(`[${SCROLL_MARK_ATTRIBUTE}]`)].find((el) => el.getAttribute(SCROLL_MARK_ATTRIBUTE) === id);
  return mark ? mark.closest(SCREEN_ROOT_SELECTOR) ?? mark.parentElement : null;
};

const keep = (id: string): void => {
  const root = rootOf(id);
  if (root) kept.set(id, scrollMarks.read(root));
};

const restore = (id: string): void => {
  let pending = kept.get(id) ?? [];
  kept.delete(id);
  let frames = 0;
  const step = (): void => {
    frames += 1;
    const root = rootOf(id);
    const last = frames >= RESTORE_FRAMES;
    if (root) pending = scrollMarks.apply(root, pending, last);
    if (pending.length > 0 && !last) requestAnimationFrame(step);
  };
  if (pending.length > 0) requestAnimationFrame(step);
};

const reopened = (state: NavigationSnapshot, prev: NavigationSnapshot): string | null =>
  (prev.closed !== null && state.closed === null && state.active === prev.closed.active ? state.active : null);

const watchScreenScroll = (): (() => void) => useNavigationStore.subscribe((state, prev) => {
  if (prev.active !== null && state.active !== prev.active) keep(prev.active);
  const back = reopened(state, prev);
  if (back !== null) restore(back);
});

const screenScroll = { watch: watchScreenScroll, keep, restore };

export { screenScroll };
