/* @layer renderer-shell @kind constants */
import { ABOUT_ENTRY, HOME_ENTRY, QUIT_ENTRY, TOP_ENTRIES } from '../app/BrockApp/BrockApp.constants';
import type { MenuItem } from '../menu/menu.type';
import { LOGS_WIDGET_ID } from '../widgets/LogsWidget/LogsWidget.constants';

const SETTLE_MS = 300;
const WAIT_MS = 3000;
const POLL_MS = 50;
const REVIEW_PROFILE_NAME = 'Review';
const ADVANCED_SECTION = 'advanced';
const ABOUT_SCREEN = ABOUT_ENTRY.screen ?? 'about';
const VERSION_LABEL = 'Version';
const PROFILES_SCREEN = 'profiles';
const LOGS_WIDGET_KEY = `widget-${LOGS_WIDGET_ID}`;
const UPDATER_MODULE_ID = 'updater';
const UPDATE_MENU_LABEL = 'Check for updates';
const CONDITIONAL_SLOT_CLASS = 'titlebar__slot--conditional';
const BOOT_OVERLAYS = ['#boot-splash', '.boot-bar', 'html.booting', '[data-boot-overlay]'] as const;
const SEARCH_TOP = 5;
const SEARCH_SETTINGS_PAGES = 4;
const SEARCH_HIT_CLASS = 'search-hit';
const POP_OUT_WAIT_MS = 8000;
const REVIEW_PREF_KEY = 'reviewProbe';

const HERO_SLOT_SELECTORS = {
  eyebrow: '.hero__eyebrow',
  art: '.hero__art',
  actions: '.hero__actions',
  tools: '.hero__tools',
  facts: '.facts-panel',
  aside: '.hero__aside',
  panel: '.hero__panel',
} as const;

const BUILT_IN_ENTRIES: readonly Pick<MenuItem, 'key' | 'label' | 'screen'>[] = [HOME_ENTRY, ...TOP_ENTRIES, ABOUT_ENTRY, QUIT_ENTRY];

const SELECTORS = {
  titleBar: '.window-title-bar',
  title: '.window-title-bar__title',
  logo: '.window-title-bar__logo',
  slot: '.titlebar__slot',
  versionTag: '.window-title-bar .version-tag',
  updateBadge: '.window-title-bar .titlebar__update-badge',
  updateDialog: '.dialog.update-dialog',
  menuButton: '.window-title-bar__start .menu-button',
  searchButton: '.window-title-bar .search-button',
  bugReportButton: '.window-title-bar .bug-report-button',
  menu: '.menu-button__drop [role="menu"]',
  subMenu: '.dropdown-menu--sub [role="menu"]',
  menuItem: [
    ':scope > .dropdown__group > .dropdown__item', ':scope > .dropdown__group > .dropdown__submenu-trigger',
    ':scope > .dropdown__item', ':scope > .dropdown__submenu-trigger',
  ].join(', '),
  menuLabel: '.dropdown__label',
  menuIcon: '.dropdown__icon',
  sectionTrigger: 'dropdown__submenu-trigger',
  layer: '.fullscreen-layer:not(.fullscreen-layer--hidden)',
  card: '.fullscreen-layer__card[role="dialog"]',
  layerTitle: '.fullscreen-layer__header .window-header__title',
  layerClose: '.fullscreen-layer__header .window-header__close',
  profileInput: '.inline-create-form input',
  profileSubmit: '.inline-create-form__actions button',
  palette: '.command-palette--open',
  bugReportDialog: '.dialog.bug-report',
  aboutLogo: '.about-panel__logo',
  aboutMark: '.about-panel__mark',
  aboutRow: '.about-panel__row',
  aboutLabel: '.stat-row__label',
  aboutValue: '.stat-row__value',
  logsWidget: '.logs-widget',
  dockPane: '.dock-layout__pane',
  mainGrip: '.dock-grip',
  hero: '.fullscreen-layer:not(.fullscreen-layer--hidden) .hero',
  heroTitle: '.hero__title',
  paletteScrim: '.command-palette-scrim',
  paletteRow: '.command-palette--open .command-palette-row',
  paletteRowIcon: '.command-palette-row__icon',
  paletteRowLabel: '.command-palette-row__label',
  paletteInput: '.command-palette--open .command-palette__input',
  hubSearchInput: '.fullscreen-layer:not(.fullscreen-layer--hidden) .section-nav__search-input',
  hubSearchHit: '.fullscreen-layer:not(.fullscreen-layer--hidden) .search-results__hit',
  dialogClose: '.dialog .window-header__close',
  hubNavItem: '.fullscreen-layer:not(.fullscreen-layer--hidden) .section-nav__item',
  hubPage: '.fullscreen-layer:not(.fullscreen-layer--hidden) .nav-layout__pane',
  switchItem: '.fullscreen-layer:not(.fullscreen-layer--hidden) .floating-switch__item',
} as const;

const RESET_CLOSERS = [
  { open: SELECTORS.menu, control: SELECTORS.menuButton },
  { open: SELECTORS.palette, control: SELECTORS.paletteScrim },
  { open: SELECTORS.bugReportDialog, control: SELECTORS.dialogClose },
  { open: SELECTORS.updateDialog, control: SELECTORS.dialogClose },
  { open: SELECTORS.layer, control: SELECTORS.layerClose },
] as const;

export {
  ABOUT_SCREEN, ADVANCED_SECTION, BOOT_OVERLAYS, BUILT_IN_ENTRIES, CONDITIONAL_SLOT_CLASS, LOGS_WIDGET_KEY, POLL_MS, PROFILES_SCREEN, RESET_CLOSERS, REVIEW_PREF_KEY, REVIEW_PROFILE_NAME,
  HERO_SLOT_SELECTORS, POP_OUT_WAIT_MS, SEARCH_HIT_CLASS, SEARCH_SETTINGS_PAGES, SEARCH_TOP, SELECTORS, SETTLE_MS, UPDATER_MODULE_ID, UPDATE_MENU_LABEL, VERSION_LABEL, WAIT_MS,
};
