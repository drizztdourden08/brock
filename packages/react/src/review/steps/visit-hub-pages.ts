/* @layer renderer-shell @kind logic */
import type { HubDef, HubPage } from '../../hub/hub.type';
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
  const { hint, leave } = await pointSettingRow(find(SELECTORS.hubPage) ?? document);
  tour.check(`${id}-row-hint`, hint !== null, `pointing at a settings row on "${id}" shows its hint: ${hint ?? ''}`, `pointing at a settings row on "${id}" showed no hint`);
  if (hint !== null) await tour.capture(`bucket-${id}-hint`);
  leave();
};

const visitHubPages = async (tour: StepTour, hub: HubDef, pages: readonly HubPage[]): Promise<void> => {
  for (const page of pages) {
    const item = navItem(page.label);
    if (item) click(item);
    const shown = await waitFor(() => showing(hub, page));
    const id = `${hub.id}-${page.id}`;
    tour.check(`${id}-page`, shown !== null, `the "${page.label}" page of "${hub.id}" opens from its nav entry`, `the "${page.label}" page of "${hub.id}" did not open from its nav entry`);
    if (shown === null) continue;
    if (page.fullBleed !== true) tour.report(pageHeaderChecks(id, page.label, pageHeader(find(SELECTORS.hubPage) ?? document)));
    await tour.capture(`bucket-${id}`);
    if (page.settingsTab !== undefined) await checkRowHint(tour, id);
  }
};

export { visitHubPages };
