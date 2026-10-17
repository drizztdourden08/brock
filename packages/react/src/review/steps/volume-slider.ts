/* @layer renderer-shell @kind logic */
import { useVolumeStore } from '../../volume/useVolumeStore';
import { find } from '../dom/find';
import { hover } from '../dom/hover';
import { setRange } from '../dom/set-range';
import { settle } from '../dom/settle';
import { waitFor } from '../dom/wait-for';
import type { StepTour } from '../review.type';
import { closeVolumePanel } from './close-volume-panel';
import { volumePanelOpen } from './volume-panel-open';
import { VOLUME_SELECTORS, VOLUME_SLIDE, VOLUME_TOLERANCE } from './volume-step.constants';

const slides = async (): Promise<boolean> => {
  const input = find(VOLUME_SELECTORS.slider);
  if (!(input instanceof HTMLInputElement)) return false;
  const start = useVolumeStore.getState();
  const next = start.value > VOLUME_SLIDE ? start.value - VOLUME_SLIDE : start.value + VOLUME_SLIDE;
  setRange(input, next);
  const moved = (await waitFor(() => Math.abs(useVolumeStore.getState().value - next) < VOLUME_TOLERANCE)) !== null;
  useVolumeStore.getState().setValue(start.value);
  useVolumeStore.getState().setMuted(start.muted);
  return moved;
};

const opensOnFocus = async (item: HTMLElement): Promise<boolean> => {
  const button = find(VOLUME_SELECTORS.button, item);
  if (!button) return false;
  button.focus({ focusVisible: true });
  const open = (await waitFor(volumePanelOpen)) !== null;
  await closeVolumePanel(item);
  return open;
};

const reviewSlider = async (tour: StepTour, id: string, item: HTMLElement): Promise<{ hoverOpens: boolean; focusOpens: boolean; slides: boolean }> => {
  hover(item);
  const hoverOpens = (await waitFor(volumePanelOpen)) !== null;
  await settle();
  await tour.capture(`volume-${id}-slider`);
  const moved = hoverOpens && await slides();
  await closeVolumePanel(item);
  return { hoverOpens, focusOpens: await opensOnFocus(item), slides: moved };
};

export { reviewSlider };
