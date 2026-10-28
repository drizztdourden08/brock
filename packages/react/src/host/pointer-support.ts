/* @layer renderer-shell @kind logic */
import type { PointerSupport } from './pointer-support.type';

const pointerSupport = (): PointerSupport => {
  const pointerEvents = typeof PointerEvent !== 'undefined';
  return {
    pointerEvents,
    coalesced: pointerEvents && 'getCoalescedEvents' in PointerEvent.prototype,
    pressure: pointerEvents && 'pressure' in PointerEvent.prototype,
  };
};

export { pointerSupport };
