/* @layer renderer-shell @kind logic */
import { SETTLING_EVENTS } from './dom-wake.constants';
import type { WakeSource } from './wake.type';

const domWake: WakeSource = (wake) => {
  if (typeof document === 'undefined') return () => undefined;
  const stops: (() => void)[] = [];
  if (typeof MutationObserver !== 'undefined') {
    const mutations = new MutationObserver(wake);
    mutations.observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
    stops.push(() => mutations.disconnect());
  }
  if (typeof ResizeObserver !== 'undefined') {
    const sizes = new ResizeObserver(wake);
    sizes.observe(document.documentElement);
    stops.push(() => sizes.disconnect());
  }
  for (const name of SETTLING_EVENTS) {
    document.addEventListener(name, wake, true);
    stops.push(() => document.removeEventListener(name, wake, true));
  }
  return () => { for (const stop of stops) stop(); };
};

export { domWake };
