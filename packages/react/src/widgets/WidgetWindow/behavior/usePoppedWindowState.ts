/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { WidgetPinMode, WidgetWindowGroup, WidgetWindowState } from '@drizztdourden08/brock-core';
import { hostApi } from '../../../host/host-api';
import { INITIAL_WINDOW_STATE } from '../WidgetWindow.constants';

const usePoppedWindowState = (id: string) => {
  const [state, setState] = useState<WidgetWindowState>(INITIAL_WINDOW_STATE);

  useEffect(() => {
    const api = hostApi();
    if (!api) return undefined;
    let live = true;
    void api.getWidgetWindowState(id).then((current) => {
      if (current && live) setState(current);
    });
    const off = api.onWidgetWindowState(setState);
    return () => {
      live = false;
      off();
    };
  }, [id]);

  const setPin = useCallback((mode: WidgetPinMode) => {
    void hostApi()?.setWidgetPin(id, mode);
  }, [id]);
  const setSnap = useCallback((on: boolean) => hostApi()?.setWidgetSnap(id, on), [id]);
  const setSync = useCallback((on: boolean) => hostApi()?.setWidgetSync(id, on), [id]);
  const setGroup = useCallback((group: WidgetWindowGroup | null) => hostApi()?.setWidgetGroup(id, group), [id]);

  return { ...state, setPin, setSnap, setSync, setGroup };
};

export { usePoppedWindowState };
