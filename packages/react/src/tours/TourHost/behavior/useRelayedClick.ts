/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import { hostApi } from '../../../host/host-api';
import { shareWithWidgets } from '../../../widgets/share-with-widgets';
import { RELAY_SLICES } from '../../../widgets/widget.constants';
import { tourTargets } from '../../resolve-tour-target';
import type { TourClickSlice, TourStepDef } from '../../tour.type';
import { useTourStore } from '../../useTourStore';

const clickRelayOf = (shown: TourStepDef | null, key: string): TourClickSlice | null => {
  const part = shown ? tourTargets.poppedClick(shown) : null;
  return part ? { ...part, step: key } : null;
};

const useRelayedClick = (shown: TourStepDef | null, key: string, popped: unknown, next: () => void): void => {
  const latest = useRef(next);
  latest.current = next;

  useEffect(() => {
    const stop = shareWithWidgets(useTourStore, { kind: RELAY_SLICES.tourClick, pick: (state) => state.clickRelay, delay: 0 });
    const off = hostApi()?.onWidgetTourAdvance((step) => {
      if (useTourStore.getState().clickRelay?.step !== step) return;
      useTourStore.getState().setClickRelay(null);
      latest.current();
    }) ?? (() => undefined);
    return () => {
      off();
      useTourStore.getState().setClickRelay(null);
      stop();
    };
  }, []);

  useEffect(() => {
    useTourStore.getState().setClickRelay(clickRelayOf(shown, key));
  }, [shown, key, popped]);
};

export { useRelayedClick };
