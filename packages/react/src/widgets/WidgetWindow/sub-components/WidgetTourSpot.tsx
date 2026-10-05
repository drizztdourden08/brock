/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { TourSpot } from '@drizztdourden08/tessera/composites';
import type { TourSpotSlice } from '../../../tours/tour.type';
import { useWidgetRelayStore } from '../../useWidgetRelayStore';
import { RELAY_SLICES } from '../../widget.constants';
import { TOUR_SPOT_KEEP } from '../WidgetWindow.constants';
import type { WidgetTourSpotProps } from '../WidgetWindow.type';

const isSpot = (value: unknown): value is TourSpotSlice =>
  typeof value === 'object' && value !== null && 'widget' in value && 'selector' in value && typeof value.selector === 'string';

const WidgetTourSpot = (props: WidgetTourSpotProps) => {
  const { id } = props;
  const slice = useWidgetRelayStore((s) => s.slices[RELAY_SLICES.tourSpot]);
  const selector = isSpot(slice) && slice.widget === id ? slice.selector : null;
  const target = useMemo(() => (selector === null ? null : { selector }), [selector]);
  return target ? <TourSpot target={target} keep={TOUR_SPOT_KEEP} /> : null;
};

export { WidgetTourSpot };
