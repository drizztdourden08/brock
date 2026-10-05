/* @layer renderer-shell @kind constants */
import { ABOUT_ENTRY, HOME_ENTRY, QUIT_ENTRY, TOP_ENTRIES } from '../app/BrockApp/BrockApp.constants';
import type { MenuItem } from '../menu/menu.type';
import { LOGS_WIDGET_ID } from '../widgets/built-in/LogsWidget/LogsWidget.constants';
import { PERFORMANCE_WIDGET_ID } from '../widgets/built-in/PerformanceWidget/PerformanceWidget.constants';

const SETTLE_MS = 300;
const WAIT_MS = 3000;
const POLL_MS = 50;
const REVIEW_PROFILE_NAME = 'Review';
const SECTION_KEY_PREFIX = 'section:';
const ABOUT_SCREEN = ABOUT_ENTRY.screen ?? 'about';
const VERSION_LABEL = 'Version';
const PROFILES_SCREEN = 'profiles';
const LOGS_WIDGET_KEY = `widget-${LOGS_WIDGET_ID}`;
const PERFORMANCE_WIDGET_KEY = `widget-${PERFORMANCE_WIDGET_ID}`;
const PERFORMANCE_LIVE_MS = 2500;
const PERFORMANCE_TILES = { frameRate: 'Frame rate', cpu: 'CPU', memory: 'Memory', lag: 'Event loop lag' } as const;
const PERFORMANCE_GAUGES: readonly string[] = ['CPU', 'Memory'];
const PERFORMANCE_PROCESSES: readonly string[] = ['Main', 'Renderer'];
const FPS_VALUE = /^\d+$/;
const PERFORMANCE_WINDOW_SIZES = [
  { name: 'performance-window-narrow', bounds: { width: 320, height: 760 } },
  { name: 'performance-window-wide', bounds: { width: 780, height: 620 } },
] as const;
const UPDATER_MODULE_ID = 'updater';
const UPDATE_MENU_LABEL = 'Check for updates';
const BAR_ITEM_ATTRIBUTE = 'data-bar-item';
const BAR_ITEM_PREFIX = 'action:';
const BOOT_OVERLAYS = ['#boot-splash', '.boot-bar', 'html.booting', '[data-boot-overlay]'] as const;
const SEARCH_TOP = 5;
const SEARCH_SETTINGS_PAGES = 4;
const SEARCH_HIT_CLASS = 'search-hit';
const SEARCH_MISS = 'qzxjvw';
const POP_OUT_WAIT_MS = 8000;
const POPPED_PAINT_MS = 1500;
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
  anyMenuItem: '.dropdown__item',
  askingMenuItem: '.dropdown__item--asking',
  menuLabel: '.dropdown__label',
  menuAsk: '.dropdown__label--ask [aria-live]',
  menuLabelShown: ':scope > [aria-live]',
  menuIcon: '.dropdown__icon',
  sectionTrigger: 'dropdown__submenu-trigger',
  layer: '.screen-layer:not(.screen-layer--hidden)',
  card: '.screen-layer__frame[role="dialog"] .screen-layer__card',
  layerTitle: '.screen-window__header .window-header__title',
  layerClose: '.screen-window__header .window-header__close',
  layerBack: '.screen-layer:not(.screen-layer--hidden) .screen-window__header .window-header__back',
  pageHead: '.content-header',
  pageIcon: '.content-header__icon',
  pageTitle: '.content-header__title',
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
  performanceWidget: '.performance-widget',
  widgetBody: '.widget__content',
  scrollArea: '.scroll-area',
  statTile: '.stat-tile',
  statTileLabel: '.stat-tile__label',
  statTileValue: '.stat-tile__value',
  sparklineLine: '.sparkline__line',
  gaugeLabel: '.gauge__label',
  barSegment: '.stacked-bar__segment',
  barName: '.stacked-bar__name',
  dockPane: '.dock-layout__pane',
  mainGrip: '.dock-grip',
  hero: '.screen-layer:not(.screen-layer--hidden) .hero',
  heroTitle: '.hero__title',
  paletteScrim: '.command-palette-scrim',
  paletteHeading: '.command-palette--open .command-palette__heading',
  paletteRow: '.command-palette--open .command-palette-row',
  paletteRowIcon: '.command-palette-row__icon',
  paletteRowLabel: '.command-palette-row__label',
  paletteInput: '.command-palette--open input.command-palette__input, .command-palette--open .command-palette__input input',
  hubSearchInput: '.screen-layer:not(.screen-layer--hidden) input.side-nav__search-input, .screen-layer:not(.screen-layer--hidden) .side-nav__search-input input',
  hubSearchMark: '.screen-layer:not(.screen-layer--hidden) .side-nav__search-mark',
  hubSearchResults: '.screen-layer:not(.screen-layer--hidden) .search-results',
  hubSearchIdle: '.screen-layer:not(.screen-layer--hidden) .search-results--idle',
  hubSearchEmpty: '.screen-layer:not(.screen-layer--hidden) .search-results__body .search-results__empty',
  mascot: '.animated-mascot-auto',
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
  ABOUT_SCREEN, BAR_ITEM_ATTRIBUTE, BAR_ITEM_PREFIX, BOOT_OVERLAYS, BUILT_IN_ENTRIES, FPS_VALUE, LOGS_WIDGET_KEY, PERFORMANCE_GAUGES, PERFORMANCE_LIVE_MS, PERFORMANCE_PROCESSES, PERFORMANCE_TILES, PERFORMANCE_WIDGET_KEY, PERFORMANCE_WINDOW_SIZES, POLL_MS, PROFILES_SCREEN, RESET_CLOSERS, REVIEW_PREF_KEY, REVIEW_PROFILE_NAME, SECTION_KEY_PREFIX,
  HERO_SLOT_SELECTORS, POP_OUT_WAIT_MS, POPPED_PAINT_MS, SEARCH_HIT_CLASS, SEARCH_MISS, SEARCH_SETTINGS_PAGES, SEARCH_TOP, SELECTORS, SETTLE_MS, UPDATER_MODULE_ID, UPDATE_MENU_LABEL, VERSION_LABEL, WAIT_MS,
};
