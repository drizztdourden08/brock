/* @layer renderer-shell @kind logic */
import { contexts } from '../../contexts/contexts';
import { kitMembers } from '../../widgets/kits/kit-members';
import { useWidgetKitStore } from '../../widgets/kits/useWidgetKitStore';
import { KIT_KEY_PREFIX } from '../../widgets/kits/widget-kit.constants';
import { widgetKits } from '../../widgets/kits/widget-kits';
import type { WidgetKitDef } from '../../widgets/kits/widget-kit.type';
import { click } from '../dom/click';
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import { closeMenu } from '../menu/close-menu';
import { menuPathTo } from '../menu/menu-path-to';
import { walkToKey } from '../menu/walk-to-key';
import { WIDGETS_DEVELOPER_ENTRY, WIDGETS_DEVELOPER_KEY } from '../../widgets/widget.constants';
import type { StepTour } from '../review.type';
import { kitSelectors } from '../widgets/kit-review.constants';

const drawn = (kit: WidgetKitDef): boolean =>
  find(kitSelectors.bar(kit.id)) !== null && kitMembers(kit.id, useWidgetKitStore.getState().members).every((def) => find(kitSelectors.widget(def.id)) !== null);

const placedByApp = (tour: StepTour, kit: WidgetKitDef): boolean =>
  kit.menu?.parent !== undefined || tour.env.product.menu?.entries?.[`${KIT_KEY_PREFIX}${kit.id}`]?.parent !== undefined;

const checkDeveloperPlace = (tour: StepTour, kit: WidgetKitDef, path: readonly string[] | null): void => {
  if (kit.devOnly !== true || placedByApp(tour, kit)) return;
  const developer = menuPathTo(tour.env.menu, (entry) => entry.key === WIDGETS_DEVELOPER_KEY)?.at(-1) ?? WIDGETS_DEVELOPER_ENTRY.label;
  const inside = path?.slice(0, -2).includes(developer) === true;
  tour.check(`app-kit-${kit.id}-in-developer`, inside, `the devOnly "${kit.id}" kit sits in the ${developer} sub-menu of Widgets`, `the devOnly "${kit.id}" kit is not inside the ${developer} sub-menu`);
};

const openFromMenu = async (tour: StepTour, kit: WidgetKitDef): Promise<void> => {
  const { path, item } = await walkToKey(tour.env.menu, `${KIT_KEY_PREFIX}${kit.id}-open`);
  tour.check(`app-kit-${kit.id}-in-menu`, item !== null, `the "${kit.id}" kit has its own sub-menu under ${path?.slice(0, -1).join(' > ') ?? 'Widgets'}`, `the "${kit.id}" kit has no Open kit entry in the menu`);
  checkDeveloperPlace(tour, kit, path);
  if (!item) {
    await closeMenu();
    widgetKits.open(kit.id);
    return;
  }
  await tour.capture(`kit-${kit.id}-menu`);
  click(item);
  await closeMenu();
};

const reviewAppKit = async (tour: StepTour, kit: WidgetKitDef): Promise<void> => {
  if (kit.devOnly === true && !tour.env.developerTools) {
    tour.check(`app-kit-${kit.id}`, true, `the "${kit.id}" kit is devOnly and developer tools are off, so it stays out of the menu`, '');
    return;
  }
  const scene = kit.requires?.context;
  const was = scene ? contexts.get(scene) : null;
  if (scene) contexts.set(scene, { ...was, active: true });
  try {
    widgetKits.reset(kit.id);
    await openFromMenu(tour, kit);
    const shown = await waitFor(() => drawn(kit));
    tour.check(`app-kit-${kit.id}-opens`, shown !== null, `the "${kit.id}" kit opened its widgets and its bar together`, `the "${kit.id}" kit did not draw all its widgets`);
    if (shown) await tour.capture(`kit-${kit.id}`);
  } finally {
    widgetKits.close();
    if (scene && was) contexts.set(scene, was);
    await waitFor(() => find(kitSelectors.bar(kit.id)) === null);
  }
};

export { reviewAppKit };
