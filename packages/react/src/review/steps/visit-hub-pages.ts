/* @layer renderer-shell @kind logic */
import type { HubDef, HubPage } from '../../hub/hub.type';
import { nav } from '../../navigation/nav';
import { useNavigationStore } from '../../navigation/useNavigationStore';
import { pageHeaderChecks } from '../checks/page-header-checks';
import { click } from '../dom/click';
import { find } from '../dom/find';
import { pageHeader } from '../dom/page-header';
import { pointSettingRow } from '../dom/point-setting-row';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import type { StepTour } from '../review.type';

const navItem = (label: string): HTMLElement | undefined =>
  [...document.querySelectorAll<HTMLElement>(SELECTORS.hubNavItem)].find((item) => item.getAttribute('aria-label') === label);

const showing = (hub: HubDef, page: HubPage): boolean => {
  const { active, params } = useNavigationStore.getState();
  const section = typeof params.section === 'string' ? params.section : hub.home.id;
  const pane = find(SELECTORS.hubPage);
  return active === hub.id && section === page.id && pane !== null && pane.childElementCount > 0;
};

const checkRowHint = async (tour: StepTour, id: string): Promise<void> => {
  const { found, hint, leave } = await pointSettingRow(find(SELECTORS.hubPage) ?? document);
  if (!found) {
    tour.check(`${id}-row-hint`, true, `skipped: no settings row on "${id}" has a hint to point at`, '');
    return;
  }
  tour.check(`${id}-row-hint`, hint !== null, `pointing at a settings row on "${id}" shows its hint: ${hint ?? ''}`, `pointing at a settings row on "${id}" showed no hint`);
  if (hint !== null) await tour.capture(`bucket-${id}-hint`);
  leave();
};

const openPage = (hub: HubDef, page: HubPage, navShown: boolean): string => {
  if (!navShown) {
    if (!showing(hub, page)) nav.open(hub.id, { section: page.id });
    return 'with open, since the hub has no nav';
  }
  const item = navItem(page.label);
  if (item) click(item);
  return 'from its nav entry';
};

const visitHubPages = async (tour: StepTour, hub: HubDef, pages: readonly HubPage[], navShown: boolean): Promise<void> => {
  for (const page of pages) {
    const how = openPage(hub, page, navShown);
    const shown = await waitFor(() => showing(hub, page));
    const id = `${hub.id}-${page.id}`;
    tour.check(`${id}-page`, shown !== null, `the "${page.label}" page of "${hub.id}" opens ${how}`, `the "${page.label}" page of "${hub.id}" did not open ${how}`);
    if (shown === null) continue;
    if (page.fullBleed !== true) tour.report(pageHeaderChecks(id, page.label, pageHeader(find(SELECTORS.hubPage) ?? document)));
    await tour.capture(`bucket-${id}`);
    if (page.settingsTab !== undefined) await checkRowHint(tour, id);
  }
};

export { visitHubPages };
