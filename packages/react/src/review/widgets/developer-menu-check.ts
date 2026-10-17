/* @layer renderer-shell @kind logic */
import { WIDGETS_SECTION } from '../../app/BrockApp/BrockApp.constants';
import { isWidgetOpen } from '@drizztdourden08/tessera/composites';
import { MENU_SECTIONS } from '../../menu/menu.constants';
import { WIDGETS_DEVELOPER_ENTRY, WIDGETS_DEVELOPER_KEY } from '../../widgets/widget.constants';
import { KIT_WORDS } from '../../widgets/kits/widget-kit.constants';
import { closeMenu } from '../menu/close-menu';
import { menuPathTo } from '../menu/menu-path-to';
import { readMenuPanel } from '../menu/read-menu-panel';
import { walkMenu } from '../menu/walk-menu';
import type { StepTour } from '../review.type';
import { until } from '../dom/until';
import { DEV_MENU_KIT, DEV_MENU_WIDGET, SECTION_KEY_PREFIX } from './kit-review.constants';
import { widgetKits } from '../../widgets/kits/widget-kits';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { widgets } from '../../widgets/widgets';
import { withDeveloperTools } from './with-developer-tools';
import { withDeveloperEntries } from './with-developer-entries';

const widgetsLabel = MENU_SECTIONS.find((section) => section.id === WIDGETS_SECTION)?.label ?? WIDGETS_SECTION;

const developerPath = (tour: StepTour): string[] => {
  const { menu, product } = tour.env;
  const known = menuPathTo(menu, (item) => item.key === WIDGETS_DEVELOPER_KEY);
  if (known) return known;
  const section = menuPathTo(menu, (item) => item.key === `${SECTION_KEY_PREFIX}${WIDGETS_SECTION}`) ?? [widgetsLabel];
  return [...section, product.menu?.entries?.[WIDGETS_DEVELOPER_KEY]?.label ?? WIDGETS_DEVELOPER_ENTRY.label];
};

const panelHas = async (parents: readonly string[], labels: readonly string[], present: boolean): Promise<boolean> =>
  until(async () => {
    const shown = await readMenuPanel(parents);
    return shown !== null && labels.every((label) => shown.includes(label) === present);
  });

const checkShown = async (tour: StepTour, path: readonly string[]): Promise<void> => {
  const route = path.join(' > ');
  const listed = await panelHas(path, [DEV_MENU_WIDGET.label, DEV_MENU_KIT.label], true);
  tour.check('widgets-developer-shown', listed, `with developer tools on, ${route} lists the devOnly widget and the devOnly kit`, `with developer tools on, ${route} does not list the devOnly widget and kit`);
  await closeMenu();
  const open = await walkMenu([...path, DEV_MENU_KIT.label], KIT_WORDS.open);
  tour.check('widgets-developer-kit', open !== null, `the devOnly kit is its own sub-menu inside ${route}, with ${KIT_WORDS.open}`, `the devOnly kit has no sub-menu with ${KIT_WORDS.open} inside ${route}`);
  if (open) await tour.capture('widgets-developer-menu');
  await closeMenu();
};

const checkHidden = async (tour: StepTour, path: readonly string[]): Promise<void> => {
  const parents = path.slice(0, -1);
  const gone = await panelHas(parents, path.slice(-1), false);
  tour.check('widgets-developer-hidden', gone, `with developer tools off, ${parents.join(' > ')} has no ${path.at(-1) ?? ''} sub-menu`, `with developer tools off, ${parents.join(' > ')} still shows ${path.at(-1) ?? ''}`);
  await closeMenu();
};

const devOpen = (): boolean => isWidgetOpen(useWidgetLayoutStore.getState().layout, DEV_MENU_WIDGET.id) || widgetKits.active() === DEV_MENU_KIT.id;

const checkCloses = async (tour: StepTour, path: readonly string[], switchTo: (on: boolean) => Promise<void>): Promise<void> => {
  widgets.open(DEV_MENU_WIDGET.id);
  const widgetOpen = await until(() => Promise.resolve(isWidgetOpen(useWidgetLayoutStore.getState().layout, DEV_MENU_WIDGET.id)));
  widgetKits.open(DEV_MENU_KIT.id);
  const kitOpen = await until(() => Promise.resolve(widgetKits.active() === DEV_MENU_KIT.id));
  await switchTo(false);
  const closed = widgetOpen && kitOpen && await until(() => Promise.resolve(!devOpen()));
  tour.check('widgets-developer-closes', closed, 'turning developer tools off closed the open devOnly widget and the open devOnly kit', 'turning developer tools off left a devOnly widget or kit open');
  await checkHidden(tour, path);
  await switchTo(true);
  const back = await panelHas(path, [DEV_MENU_WIDGET.label, DEV_MENU_KIT.label], true);
  tour.check('widgets-developer-back', back && !devOpen(), `turning developer tools back on brought ${path.join(' > ')} back, with the closed widget and kit left closed`, `turning developer tools back on did not bring ${path.join(' > ')} back as it was`);
  await closeMenu();
};

const checkDeveloperMenu = async (tour: StepTour): Promise<void> => {
  const path = developerPath(tour);
  await withDeveloperEntries(async () => {
    await withDeveloperTools(async (switchTo) => {
      await checkShown(tour, path);
      await checkCloses(tour, path, switchTo);
    });
  });
};

export { checkDeveloperMenu };
