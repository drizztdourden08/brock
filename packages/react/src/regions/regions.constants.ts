/* @layer renderer-shell @kind constants */
const REGION_ATTRIBUTE = 'data-focus-region';

const MARKED_SELECTOR = `[${REGION_ATTRIBUTE}]`;

const STOP_SELECTOR = '.toolbar-dock__lane';

const MAIN_SELECTOR = 'main, [role="main"]';

const LANDMARK_SELECTOR =
  '[role="banner"], [role="navigation"], nav[aria-label], [role="complementary"][aria-label], [role="region"][aria-label], [role="region"][aria-labelledby], [role="toolbar"]';

const REGION_SELECTOR = [MARKED_SELECTOR, STOP_SELECTOR, MAIN_SELECTOR, LANDMARK_SELECTOR].join(', ');

const ROVING_SELECTOR = '[tabindex="0"]:not(:disabled)';

const TABBABLE_SELECTOR =
  'button:not(:disabled), a[href], input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

const HIDDEN_SELECTOR = '[aria-hidden="true"], [inert], [hidden]';

const MODAL_SELECTOR = '[role="dialog"][aria-modal="true"], [role="alertdialog"], dialog[open]';

const REGION_COMMANDS = {
  next: 'brock.region.next',
  previous: 'brock.region.previous',
} as const;

const REGION_TEXT = {
  next: 'Focus the next region',
  previous: 'Focus the previous region',
} as const;

const SHELL_LABELS = {
  titleBar: 'Title bar',
  screens: 'Screens',
} as const;

export {
  HIDDEN_SELECTOR, MAIN_SELECTOR, MARKED_SELECTOR, MODAL_SELECTOR, REGION_COMMANDS, REGION_SELECTOR, REGION_TEXT, ROVING_SELECTOR, SHELL_LABELS, STOP_SELECTOR, TABBABLE_SELECTOR,
};
