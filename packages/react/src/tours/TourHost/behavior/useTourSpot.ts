/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { shareWithWidgets } from '../../../widgets/share-with-widgets';
import { RELAY_SLICES } from '../../../widgets/widget.constants';
import { tourTargets } from '../../resolve-tour-target';
import type { TourStepDef } from '../../tour.type';
import { useTourStore } from '../../useTourStore';

const useTourSpot = (shown: TourStepDef | null, popped: unknown): void => {
  useEffect(() => {
    const stop = shareWithWidgets(useTourStore, { kind: RELAY_SLICES.tourSpot, pick: (state) => state.spot, delay: 0 });
    return () => {
      useTourStore.getState().setSpot(null);
      stop();
    };
  }, []);

  useEffect(() => {
    useTourStore.getState().setSpot(shown ? tourTargets.poppedSpot(shown) : null);
  }, [shown, popped]);
};

export { useTourSpot };
