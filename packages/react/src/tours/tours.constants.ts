/* @layer renderer-shell @kind constants */
import type { TourDef, TourProgress, TourShellPart } from './tour.type';

const NO_TOURS: readonly TourDef[] = [];

const EMPTY_PROGRESS: TourProgress = { completed: [], started: [], last: {} };

const SHELL_TARGETS: Readonly<Record<TourShellPart, string>> = {
  'menu': '.window-title-bar__start .dropdown-trigger',
  'search': '.window-title-bar [data-bar-item="action:search"]',
  'report-bug': '.window-title-bar [data-bar-item="action:report-bug"]',
  'title-bar': '.window-title-bar',
  'screen': '.screen-layer:not(.screen-layer--hidden) .screen-layer__card',
};

const QUOTED = /["\\]/g;

const TITLE_BAR_SELECTOR = SHELL_TARGETS['title-bar'];

const FIRST_RUN_DELAY_MS = 600;

const TOUR_MENU_KEY = 'take-the-tour';

const TOUR_MENU_LABEL = 'Take the tour';

const TOUR_ICON = 'compass';

const HELP_SECTION = 'help';

const FALLBACK_SECTION = 'advanced';

const TOUR_SEARCH_GROUP = 'Tours';

const TOUR_KEYWORDS: readonly string[] = ['tour', 'guide', 'help', 'walkthrough', 'introduction'];

export {
  EMPTY_PROGRESS, QUOTED, FALLBACK_SECTION, FIRST_RUN_DELAY_MS, HELP_SECTION, NO_TOURS, SHELL_TARGETS, TITLE_BAR_SELECTOR, TOUR_ICON,
  TOUR_KEYWORDS, TOUR_MENU_KEY, TOUR_MENU_LABEL, TOUR_SEARCH_GROUP,
};
