/* @layer renderer-shell @kind constants */
const LOADING_ATTRIBUTE = 'data-brock-loading';
const IDLE_POLL_MS = 50;
const BOOT_IDLE_MS = 30000;
const REVIEW_IDLE_MS = 20000;
const PRELOAD_TARGETS = '.dropdown__item, .dropdown__submenu-trigger, .side-nav__item, .floating-switch__item';
const PRELOAD_LABELS = '.dropdown__label, .side-nav__label, .floating-switch__label';

export { BOOT_IDLE_MS, IDLE_POLL_MS, LOADING_ATTRIBUTE, PRELOAD_LABELS, PRELOAD_TARGETS, REVIEW_IDLE_MS };
