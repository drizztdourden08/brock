/* @layer renderer-shell @kind logic */
import { hostApi } from '../host/host-api';
import { useProfilesStore } from '../stores/useProfilesStore';
import { sameSlice } from './same-slice';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import { useWidgetRelayStore } from './useWidgetRelayStore';
import { RELAY_DELAY_MS } from './widget.constants';
import { widgetWindowId } from './widget-window-id';
import type { ShareOptions, SharedStore } from './widget.type';

const noop = (): void => undefined;

const shareWithWidgets = <S, T>(store: SharedStore<S>, options: ShareOptions<S, T>): (() => void) => {
  const { kind, pick, delay = RELAY_DELAY_MS } = options;
  if (widgetWindowId() !== null) return noop;
  let current = pick(store.getState());
  let timer: ReturnType<typeof setTimeout> | null = null;
  useWidgetRelayStore.getState().receive(kind, current);

  const send = (): void => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    hostApi()?.publishWidgetSlice({ kind, data: current });
  };
  const popped = (): boolean => useWidgetLayoutStore.getState().layout.popped.length > 0;
  const later = (): void => {
    if (!popped()) return;
    if (delay <= 0) send();
    else timer ??= setTimeout(send, delay);
  };
  const offStore = store.subscribe((state) => {
    const next = pick(state);
    if (sameSlice(next, current)) return;
    current = next;
    useWidgetRelayStore.getState().receive(kind, next);
    later();
  });
  const offProfile = useProfilesStore.subscribe((state, prev) => {
    if (state.active?.id !== prev.active?.id && popped()) send();
  });
  const offSnapshot = hostApi()?.onWidgetSnapshotRequest(send) ?? noop;

  return () => {
    if (timer !== null) clearTimeout(timer);
    offStore();
    offProfile();
    offSnapshot();
  };
};

export { shareWithWidgets };
