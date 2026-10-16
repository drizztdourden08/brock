/* @layer renderer-shell @kind hook */
import { useCallback, useSyncExternalStore } from 'react';
import type { TuckedControls } from '../../../shell/TitleBar/behavior/pin-state.type';
import { ITEM_AWAY_CLASS, NOT_TUCKED, TITLE_BAR_CLASS, TUCKED_ITEMS } from '../sub-components/AppTitleBar/AppTitleBar.constants';

const barOf = (): Element | null => document.querySelector(`.${TITLE_BAR_CLASS}`);

const isAway = (bar: Element | null, item: string): boolean => bar?.querySelector(`[data-bar-item="${item}"]`)?.classList.contains(ITEM_AWAY_CLASS) === true;

const readTucked = (): string => {
  const bar = barOf();
  return Object.values(TUCKED_ITEMS).filter((item) => isAway(bar, item)).join(' ');
};

const useTuckedControls = (enabled: boolean): TuckedControls => {
  const subscribe = useCallback((onChange: () => void): (() => void) => {
    const bar = enabled ? barOf() : null;
    if (bar === null) return () => undefined;
    const observer = new MutationObserver(onChange);
    observer.observe(bar, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [enabled]);
  const tucked = useSyncExternalStore(subscribe, () => (enabled ? readTucked() : NOT_TUCKED), () => NOT_TUCKED).split(' ');
  return { pin: tucked.includes(TUCKED_ITEMS.pin), fullscreen: tucked.includes(TUCKED_ITEMS.fullscreen) };
};

export { useTuckedControls };
