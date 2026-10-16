/* @layer renderer-shell @kind logic */
import { volumeItems } from '../../title-bar/volume-items';
import { useVolumeStore } from '../../volume/useVolumeStore';
import { volumeChecks } from '../checks/volume-checks';
import { click } from '../dom/click';
import { find } from '../dom/find';
import { hover } from '../dom/hover';
import { settle } from '../dom/settle';
import { unhover } from '../dom/unhover';
import { waitFor } from '../dom/wait-for';
import { closeMenu } from '../menu/close-menu';
import { openMenu } from '../menu/open-menu';
import { readMenu } from '../menu/read-menu';
import { BAR_ITEM_PREFIX, NARROW_WINDOW, SELECTORS } from '../review.constants';
import type { ReviewStep, StepTour } from '../review.type';
import { probe } from '../widgets/probe';

const barItem = (id: string): HTMLElement | null => find(`${SELECTORS.titleBar} [data-bar-item="${BAR_ITEM_PREFIX}${id}"]`);

const flip = async (id: string): Promise<boolean> => {
  const item = barItem(id);
  if (!item) return false;
  const before = useVolumeStore.getState().muted;
  click(item);
  return (await waitFor(() => useVolumeStore.getState().muted !== before)) !== null;
};

const mutes = async (tour: StepTour, id: string): Promise<{ toggled: boolean; restored: boolean }> => {
  const startMuted = useVolumeStore.getState().muted;
  if (startMuted) await tour.capture(`volume-${id}-muted`);
  const toggled = await flip(id);
  await settle();
  if (toggled && !startMuted) await tour.capture(`volume-${id}-muted`);
  const restored = toggled && await flip(id);
  await settle();
  return { toggled, restored };
};

const tucks = async (tour: StepTour, id: string): Promise<{ width: number; tucked: boolean; inMenu: boolean }> => {
  const start = (await probe({ kind: 'main' })).bounds;
  const width = tour.env.product.window.minSize.width;
  if (start === null) return { width, tucked: false, inMenu: false };
  await probe({ kind: 'main', bounds: { ...start, width, height: NARROW_WINDOW.height } });
  await settle();
  const tucked = barItem(id)?.inert === true;
  const label = barItem(id)?.getAttribute('aria-label') ?? tour.env.actions.find((action) => action.id === id)?.label ?? '';
  await openMenu();
  const inMenu = readMenu().items.some((item) => item.label === label);
  await tour.capture(`volume-${id}-menu`);
  await closeMenu();
  await probe({ kind: 'main', bounds: start });
  await settle();
  return { width, tucked, inMenu };
};

const reviewVolume = async (tour: StepTour, id: string): Promise<void> => {
  const item = barItem(id);
  const shown = item?.querySelector('svg') != null;
  await tour.capture(`volume-${id}-rest`);
  if (item) {
    hover(item);
    await settle();
    await tour.capture(`volume-${id}-hover`);
    unhover(item);
  }
  const muting = await mutes(tour, id);
  tour.report(volumeChecks(id, { shown, ...muting, ...(await tucks(tour, id)) }));
};

const volumeStep: ReviewStep = {
  name: 'volume',
  run: async (tour) => {
    const ids = volumeItems.list().filter((id) => tour.env.actions.some((action) => action.id === id));
    for (const id of ids) await reviewVolume(tour, id);
  },
};

export { volumeStep };
