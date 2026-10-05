/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { hostApi } from '../../../host/host-api';
import type { TourClickSlice } from '../../../tours/tour.type';
import { useWidgetRelayStore } from '../../useWidgetRelayStore';
import { RELAY_SLICES } from '../../widget.constants';

const isClickSlice = (value: unknown): value is TourClickSlice =>
  typeof value === 'object' && value !== null && 'widget' in value && 'selector' in value && 'step' in value
  && typeof value.selector === 'string' && typeof value.step === 'string';

const armClick = (selector: string, step: string): (() => void) => {
  let sent = false;
  const onClick = (event: MouseEvent): void => {
    const target = document.querySelector(selector);
    if (sent || !target || !(event.target instanceof Node) || !target.contains(event.target)) return;
    sent = true;
    hostApi()?.advanceWidgetTour(step);
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
};

const useWidgetTourClick = (id: string): void => {
  const slice = useWidgetRelayStore((s) => s.slices[RELAY_SLICES.tourClick]);
  const wanted = isClickSlice(slice) && slice.widget === id ? slice : null;
  const selector = wanted?.selector ?? null;
  const step = wanted?.step ?? null;

  useEffect(() => (selector === null || step === null ? undefined : armClick(selector, step)), [selector, step]);
};

export { useWidgetTourClick };
