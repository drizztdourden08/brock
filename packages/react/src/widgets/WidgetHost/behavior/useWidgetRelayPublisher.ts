/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { hostApi } from '../../../host/host-api';
import { getAppLog } from '../../../log/get-app-log';
import { useWidgetPrefStore } from '../../../stores/useWidgetPrefStore';
import { RELAY_DELAY_MS, RELAY_SLICES } from '../../widget.constants';
import { useWidgetLayoutStore } from '../../useWidgetLayoutStore';

const publish = (kind: string, data: unknown): void => hostApi()?.publishWidgetSlice({ kind, data });

const snapshot = (): void => {
  publish(RELAY_SLICES.frames, useWidgetLayoutStore.getState().layout.frame);
  publish(RELAY_SLICES.prefs, useWidgetPrefStore.getState().byWidget);
  publish(RELAY_SLICES.log, getAppLog().getEntries());
};

const relay = (): (() => void) => {
  const api = hostApi();
  if (!api) return () => undefined;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const offs = [
    api.onWidgetSnapshotRequest(snapshot),
    useWidgetLayoutStore.subscribe((state, prev) => {
      if (state.layout.frame !== prev.layout.frame) publish(RELAY_SLICES.frames, state.layout.frame);
    }),
    useWidgetPrefStore.subscribe((state, prev) => {
      if (state.byWidget !== prev.byWidget) publish(RELAY_SLICES.prefs, state.byWidget);
    }),
    getAppLog().subscribe(() => {
      timer ??= setTimeout(() => {
        timer = null;
        publish(RELAY_SLICES.log, getAppLog().getEntries());
      }, RELAY_DELAY_MS);
    }),
  ];
  snapshot();
  return () => {
    if (timer) clearTimeout(timer);
    for (const off of offs) off();
  };
};

const useWidgetRelayPublisher = (): void => {
  const active = useWidgetLayoutStore((s) => s.layout.popped.length > 0);
  useEffect(() => (active ? relay() : undefined), [active]);
};

export { useWidgetRelayPublisher };
