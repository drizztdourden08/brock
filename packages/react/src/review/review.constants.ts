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

const BUILT_IN_ENTRIES: readonly Pick<MenuItem, 'key' | 'label' | 'screen'>[] = [HOME_ENTRY, ...TOP_ENTRIES, ABOUT_ENTRY, QUIT_ENTRY];

const SELECTORS = {
  titleBar: '.titlebar',
  title: '.titlebar__title',
  logo: '.titlebar__logo',
  slot: '.titlebar__slot',
  versionTag: '.titlebar .version-tag',
  updateBadge: '.titlebar .titlebar__update-badge',
  updateDialog: '.dialog.update-dialog',
  menuButton: '.titlebar__left button[aria-label="Menu"]',
  searchButton: '.titlebar .search-button',
  bugReportButton: '.titlebar .bug-report-button',
  menu: '.dropdown-menu:not(.dropdown-menu--sub)',
  subMenu: '.dropdown-menu--sub',
  menuItem: ':scope > .dropdown__item, :scope > .dropdown__submenu-trigger',
  menuLabel: '.dropdown__label',
  menuIcon: '.dropdown__icon',
  sectionTrigger: 'dropdown__submenu-trigger',
  layer: '.fullscreen-layer:not(.fullscreen-layer--hidden)',
  card: '.fullscreen-layer__card[role="dialog"]',
  layerTitle: '.fullscreen-layer__header .window-header__title',
  layerClose: '.fullscreen-layer__header .window-header__close',
  profileInput: '.create-profile-form input',
  profileSubmit: '.create-profile-form__actions button',
  palette: '.search-palette.is-open',
  bugReportDialog: '.dialog.bug-report',
  aboutLogo: '.about__logo',
  aboutRow: '.about__row',
  aboutLabel: '.about__label',
  aboutValue: '.about__value',
  logsWidget: '.logs-widget',
  paletteScrim: '.search-scrim',
  paletteRow: '.search-palette.is-open .search-row',
  paletteRowIcon: '.search-row__icon',
  paletteRowLabel: '.search-row__label',
  dialogClose: '.dialog .window-header__close',
  hubNavItem: '.fullscreen-layer:not(.fullscreen-layer--hidden) .section-nav__item',
  hubPage: '.fullscreen-layer:not(.fullscreen-layer--hidden) .hub-screen__page',
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
  ABOUT_SCREEN, ADVANCED_SECTION, BUILT_IN_ENTRIES, CONDITIONAL_SLOT_CLASS, LOGS_WIDGET_KEY, POLL_MS, PROFILES_SCREEN, RESET_CLOSERS, REVIEW_PROFILE_NAME,
  SELECTORS, SETTLE_MS, UPDATE_MENU_LABEL, UPDATER_MODULE_ID, VERSION_LABEL, WAIT_MS,
};
