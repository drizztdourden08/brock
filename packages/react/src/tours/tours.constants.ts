/* @layer renderer-shell @kind constants */
import type { TourAdvance } from '@drizztdourden08/tessera/composites';
import { SHELL_LABELS } from '../regions/regions.constants';
import type { AppTourState, TourDef, TourProgress, TourShellPart } from './tour.type';

const NO_TOURS: readonly TourDef[] = [];

const EMPTY_PROGRESS: TourProgress = { completed: [], started: [], last: {} };

const SHELL_TARGETS: Readonly<Record<TourShellPart, string>> = {
  'menu': '.window-title-bar__start .dropdown-trigger',
  'search': '.window-title-bar [data-bar-item="action:search"]',
  'report-bug': '.window-title-bar [data-bar-item="action:report-bug"]',
  'title-bar': '.window-title-bar',
  'screen': '.screen-layer:not(.screen-layer--hidden) .screen-layer__card',
  'page': '.brock-app__screens',
  'rail': `nav.side-nav--rail[aria-label="${SHELL_LABELS.screens}"]`,
  'hero': '.screen-host__home .hero, .screen-layer:not(.screen-layer--hidden) .hero',
  'tabs': '.screen-host__home .settings-page__tabs, .screen-layer:not(.screen-layer--hidden) .settings-page__tabs',
};

const QUOTED = /["\\]/g;

const APP_MENU_ID = 'menu';

const MENU_LABEL_SELECTOR = '[role="menu"] .dropdown__label';

const MENU_ITEM_SELECTOR = '[role^="menuitem"]';

const MENU_OPEN_ATTRIBUTE = 'aria-expanded';

const MENU_TRIGGER_PART = '.dropdown-trigger';

const TITLE_BAR_SELECTOR = SHELL_TARGETS['title-bar'];

const POPPED_WIDGET_PART = '.widget__content';

const FIRST_RUN_DELAY_MS = 600;

const PROFILE_TOURS_FIELD = 'tours';

const NO_TOUR_STATE: AppTourState = { progress: EMPTY_PROGRESS, firstUse: false };

const TOUR_MENU_KEY = 'take-the-tour';

const TOUR_MENU_LABEL = 'Take the tour';

const TOUR_ICON = 'compass';

const HELP_SECTION = 'help';

const FALLBACK_SECTION = 'advanced';

const TOUR_SEARCH_GROUP = 'Tours';

const TOUR_KEYWORDS: readonly string[] = ['tour', 'guide', 'help', 'walkthrough', 'introduction'];

const CLOSE_TOUR_KEY = 'Escape';

const TOUR_STEP_KEYS: Readonly<Record<TourAdvance, readonly string[]>> = {
  next: ['ArrowLeft', 'ArrowRight', 'Enter'],
  click: ['ArrowLeft'],
  wait: ['ArrowLeft'],
};

export {
  APP_MENU_ID, MENU_ITEM_SELECTOR, MENU_LABEL_SELECTOR, MENU_OPEN_ATTRIBUTE, MENU_TRIGGER_PART, CLOSE_TOUR_KEY, EMPTY_PROGRESS, TOUR_STEP_KEYS, POPPED_WIDGET_PART, QUOTED, FALLBACK_SECTION, FIRST_RUN_DELAY_MS, HELP_SECTION, NO_TOUR_STATE, NO_TOURS, PROFILE_TOURS_FIELD, SHELL_TARGETS, TITLE_BAR_SELECTOR, TOUR_ICON,
  TOUR_KEYWORDS, TOUR_MENU_KEY, TOUR_MENU_LABEL, TOUR_SEARCH_GROUP,
};
