/* @layer renderer-shell @kind logic */
import { volumeItems } from '../../title-bar/volume-items';
import { useVolumeStore } from '../../volume/useVolumeStore';
import { volumeChecks } from '../checks/volume-checks';
import { click } from '../dom/click';
import { find } from '../dom/find';
import { settle } from '../dom/settle';
import { waitFor } from '../dom/wait-for';
import { closeMenu } from '../menu/close-menu';
import { openMenu } from '../menu/open-menu';
import { readVolumeRows } from '../menu/read-volume-rows';
import { BAR_ITEM_PREFIX, NARROW_WINDOW, SELECTORS } from '../review.constants';
import type { ReviewStep, StepTour } from '../review.type';
import { probe } from '../widgets/probe';
import { closeVolumePanel } from './close-volume-panel';
import { reviewSlider } from './volume-slider';
import { VOLUME_SELECTORS } from './volume-step.constants';

const barItem = (id: string): HTMLElement | null => find(`${SELECTORS.titleBar} [data-bar-item="${BAR_ITEM_PREFIX}${id}"]`);

const muteButton = (id: string): HTMLElement | null => {
  const item = barItem(id);
  return item ? find(VOLUME_SELECTORS.button, item) : null;
};

const flip = async (id: string): Promise<boolean> => {
  const item = barItem(id);
  const button = muteButton(id);
  if (!item || !button) return false;
  const before = useVolumeStore.getState().muted;
  click(button);
  const flipped = (await waitFor(() => useVolumeStore.getState().muted !== before)) !== null;
  await closeVolumePanel(item);
  return flipped;
};

const mutes = async (tour: StepTour, id: string): Promise<{ toggled: boolean; restored: boolean }> => {
  const startMuted = useVolumeStore.getState().muted;
  if (startMuted) await tour.capture(`volume-${id}-muted`);
  const toggled = await flip(id);
  if (toggled && !startMuted) await tour.capture(`volume-${id}-muted`);
  const restored = toggled && await flip(id);
  return { toggled, restored };
};

const tucks = async (tour: StepTour, id: string): Promise<{ width: number; tucked: boolean; muteRow: boolean; sliderRow: boolean }> => {
  const start = (await probe({ kind: 'main' })).bounds;
  const width = tour.env.product.window.minSize.width;
  if (start === null) return { width, tucked: false, muteRow: false, sliderRow: false };
  await probe({ kind: 'main', bounds: { ...start, width, height: NARROW_WINDOW.height } });
  await settle();
  const tucked = barItem(id)?.inert === true;
  const label = tour.env.actions.find((action) => action.id === id)?.label ?? '';
  const muteLabel = muteButton(id)?.getAttribute('aria-label') ?? '';
  await openMenu();
  const rows = readVolumeRows(label, muteLabel);
  await tour.capture(`volume-${id}-menu`);
  await closeMenu();
  await probe({ kind: 'main', bounds: start });
  await settle();
  return { width, tucked, ...rows };
};

const reviewVolume = async (tour: StepTour, id: string): Promise<void> => {
  const item = barItem(id);
  const shown = item?.querySelector('svg') != null;
  await tour.capture(`volume-${id}-rest`);
  const slider = item ? await reviewSlider(tour, id, item) : { hoverOpens: false, focusOpens: false, slides: false };
  const muting = await mutes(tour, id);
  tour.report(volumeChecks(id, { shown, ...slider, ...muting, ...(await tucks(tour, id)) }));
};

const volumeStep: ReviewStep = {
  name: 'volume',
  run: async (tour) => {
    const ids = volumeItems.list().filter((id) => tour.env.actions.some((action) => action.id === id));
    for (const id of ids) await reviewVolume(tour, id);
  },
};

export { volumeStep };
