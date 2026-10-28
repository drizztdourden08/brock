/* @layer renderer-shell @kind logic */
interface PointerSupport {
  pointerEvents: boolean;
  coalesced: boolean;
  pressure: boolean;
}

const pointerSupport = (): PointerSupport => {
  const pointerEvents = typeof PointerEvent !== 'undefined';
  return {
    pointerEvents,
    coalesced: pointerEvents && 'getCoalescedEvents' in PointerEvent.prototype,
    pressure: pointerEvents && 'pressure' in PointerEvent.prototype,
  };
};

export { pointerSupport };
export type { PointerSupport };
