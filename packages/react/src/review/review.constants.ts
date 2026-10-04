/* @layer renderer-shell @kind constants */
import { ABOUT_ENTRY, HOME_ENTRY, QUIT_ENTRY, TOP_ENTRIES } from '../app/BrockApp/BrockApp.constants';
import type { MenuItem } from '../menu/menu.type';
import { LOGS_WIDGET_ID } from '../widgets/LogsWidget/LogsWidget.constants';

const SETTLE_MS = 300;
const WAIT_MS = 3000;
const POLL_MS = 50;
const REVIEW_PROFILE_NAME = 'Review';
const SECTION_KEY_PREFIX = 'section:';
const ABOUT_SCREEN = ABOUT_ENTRY.screen ?? 'about';
const VERSION_LABEL = 'Version';
const PROFILES_SCREEN = 'profiles';
const LOGS_WIDGET_KEY = `widget-${LOGS_WIDGET_ID}`;
const UPDATER_MODULE_ID = 'updater';
const UPDATE_MENU_LABEL = 'Check for updates';
const BAR_ITEM_ATTRIBUTE = 'data-bar-item';
const BAR_ITEM_PREFIX = 'action:';
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
  barItem: '.window-title-bar [data-bar-item]',
  versionTag: '.window-title-bar .version-tag',
  updateStatus: '.window-title-bar [data-bar-item="action:updater:check"]',
  updateDialog: '.dialog.update-dialog',
  menuButton: '.window-title-bar__start .dropdown-trigger',
  searchButton: '.window-title-bar [data-bar-item="action:search"]',
  bugReportButton: '.window-title-bar [data-bar-item="action:report-bug"]',
  menu: '.dropdown-drop [role="menu"]',
  subMenu: '.dropdown-menu--sub [role="menu"]',
  menuItem: [
    ':scope > .dropdown__group > .dropdown__item', ':scope > .dropdown__group > .dropdown__submenu-trigger',
    ':scope > .dropdown__item', ':scope > .dropdown__submenu-trigger',
  ].join(', '),
  menuLabel: '.dropdown__label',
  menuIcon: '.dropdown__icon',
  sectionTrigger: 'dropdown__submenu-trigger',
  layer: '.screen-layer:not(.screen-layer--hidden)',
  card: '.screen-layer__card[role="dialog"]',
  layerTitle: '.screen-window__header .window-header__title',
  layerClose: '.screen-window__header .window-header__close',
  pageHead: '.screen-page__head',
  pageIcon: '.screen-page__icon',
  pageTitle: '.screen-page__title',
  settingRow: '.settings-row',
  toggleRow: '.settings-row[data-kind="toggle"]',
  rowFocusable: '.settings-row__control input, .settings-row__control button, .settings-row__control [tabindex]',
  rowHint: '.settings-row__line[data-pointed] .settings-row__hint',
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
  hero: '.screen-layer:not(.screen-layer--hidden) .hero',
  heroTitle: '.hero__title',
  paletteScrim: '.command-palette-scrim',
  paletteRow: '.command-palette--open .command-palette-row',
  paletteRowIcon: '.command-palette-row__icon',
  paletteRowLabel: '.command-palette-row__label',
  paletteInput: '.command-palette--open input.command-palette__input, .command-palette--open .command-palette__input input',
  hubSearchInput: '.screen-layer:not(.screen-layer--hidden) input.side-nav__search-input, .screen-layer:not(.screen-layer--hidden) .side-nav__search-input input',
  hubSearchResults: '.screen-layer:not(.screen-layer--hidden) .search-results',
  liveControl: 'input, button, select, textarea, [role="switch"], [role="radio"], [role="slider"]',
  dialogClose: '.dialog .window-header__close',
  hubNavItem: '.screen-layer:not(.screen-layer--hidden) .side-nav__item',
  hubPage: '.screen-layer:not(.screen-layer--hidden) .side-nav-layout__pane',
  switchItem: '.screen-layer:not(.screen-layer--hidden) .floating-switch__item',
} as const;

const RESET_CLOSERS = [
  { open: SELECTORS.menu, control: SELECTORS.menuButton },
  { open: SELECTORS.palette, control: SELECTORS.paletteScrim },
  { open: SELECTORS.bugReportDialog, control: SELECTORS.dialogClose },
  { open: SELECTORS.updateDialog, control: SELECTORS.dialogClose },
  { open: SELECTORS.layer, control: SELECTORS.layerClose },
] as const;

export {
  ABOUT_SCREEN, BAR_ITEM_ATTRIBUTE, BAR_ITEM_PREFIX, BOOT_OVERLAYS, BUILT_IN_ENTRIES, LOGS_WIDGET_KEY, POLL_MS, PROFILES_SCREEN, RESET_CLOSERS, REVIEW_PREF_KEY, REVIEW_PROFILE_NAME, SECTION_KEY_PREFIX,
  HERO_SLOT_SELECTORS, POP_OUT_WAIT_MS, SEARCH_HIT_CLASS, SEARCH_SETTINGS_PAGES, SEARCH_TOP, SELECTORS, SETTLE_MS, UPDATER_MODULE_ID, UPDATE_MENU_LABEL, VERSION_LABEL, WAIT_MS,
};
