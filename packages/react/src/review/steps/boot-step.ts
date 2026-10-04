/* @layer renderer-shell @kind logic */
import { bootChecks } from '../checks/boot-checks';
import { find } from '../dom/find';
import { imageLoaded } from '../dom/image-loaded';
import { readBarItems } from '../dom/read-bar-items';
import { BOOT_OVERLAYS, SELECTORS } from '../review.constants';
import type { ReviewStep } from '../review.type';
import { expectedBarItems } from './expected-bar-items';

const isShown = (element: HTMLElement | null): boolean =>
  element !== null && element.getBoundingClientRect().height > 0 && getComputedStyle(element).opacity !== '0';

const bootStep: ReviewStep = {
  name: 'boot',
  run: async (tour) => {
    const { product, actions } = tour.env;
    tour.report(bootChecks({
      titleBarVisible: isShown(find(SELECTORS.titleBar)),
      title: find(SELECTORS.title)?.textContent.trim() ?? null,
      expectedTitle: product.window.title ?? product.name,
      logoLoaded: await imageLoaded(SELECTORS.logo),
      searchButton: find(SELECTORS.searchButton) !== null,
      bugReportButton: find(SELECTORS.bugReportButton) !== null,
      barItems: readBarItems(),
      expectedBarItems: expectedBarItems(actions),
    }));
    const overlays = BOOT_OVERLAYS.filter((selector) => document.querySelector(selector) !== null);
    tour.check('no-boot-overlay', overlays.length === 0, 'the app window holds no loading overlay; the splash window did the loading', `the app window still holds a loading overlay: ${overlays.join(', ')}`);
    await tour.capture('boot');
  },
};

export { bootStep };
