/* @layer renderer-shell @kind logic */
import { bootChecks } from '../checks/boot-checks';
import { find } from '../dom/find';
import { imageLoaded } from '../dom/image-loaded';
import { BOOT_OVERLAYS, CONDITIONAL_SLOT_CLASS, SELECTORS } from '../review.constants';
import type { ReviewStep } from '../review.type';

const isShown = (element: HTMLElement | null): boolean =>
  element !== null && element.getBoundingClientRect().height > 0 && getComputedStyle(element).opacity !== '0';

const bootStep: ReviewStep = {
  name: 'boot',
  run: async (tour) => {
    const { product, slotCount } = tour.env;
    const slots = [...document.querySelectorAll<HTMLElement>(SELECTORS.slot)];
    tour.report(bootChecks({
      titleBarVisible: isShown(find(SELECTORS.titleBar)),
      title: find(SELECTORS.title)?.textContent.trim() ?? null,
      expectedTitle: product.window.title ?? product.name,
      logoLoaded: await imageLoaded(SELECTORS.logo),
      searchButton: find(SELECTORS.searchButton) !== null,
      bugReportButton: find(SELECTORS.bugReportButton) !== null,
      slotsRendered: slots.map((slot) => slot.childElementCount > 0 || slot.classList.contains(CONDITIONAL_SLOT_CLASS)),
      expectedSlots: slotCount,
    }));
    const overlays = BOOT_OVERLAYS.filter((selector) => document.querySelector(selector) !== null);
    tour.check('no-boot-overlay', overlays.length === 0, 'the app window holds no loading overlay; the splash window did the loading', `the app window still holds a loading overlay: ${overlays.join(', ')}`);
    await tour.capture('boot');
  },
};

export { bootStep };
