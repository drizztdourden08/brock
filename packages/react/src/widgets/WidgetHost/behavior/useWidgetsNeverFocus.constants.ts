/* @layer renderer-shell @kind constants */
const WIDGET_SCOPE = '[data-widget-id], [data-pane-id], [data-floating-id], [data-widget-options], .dock-divider';

const OPTIONS_SUB_PANEL = '.control-menu__sub-panel[id]';

const OPTIONS_SUB_ROWS = '[data-widget-options] [aria-controls]';

const TYPING = [
  'input:not([type])', 'input[type="text"]', 'input[type="search"]', 'input[type="number"]', 'input[type="email"]', 'input[type="url"]',
  'input[type="tel"]', 'input[type="password"]', 'textarea', '[contenteditable=""]', '[contenteditable="true"]', '[contenteditable="plaintext-only"]',
].join(', ');

const PRESSED = 'input[type="range"], select';

const KEEPS_FOCUS = `${TYPING}, ${PRESSED}`;

const CONTROL = [
  'button', 'a[href]', 'summary', 'input', '[role="button"]', '[role="tab"]', '[role="switch"]', '[role="checkbox"]', '[role="radio"]',
  '[role="option"]', '[role="menuitem"]', '[role="menuitemcheckbox"]', '[role="menuitemradio"]', '[role="slider"]', '[role="spinbutton"]',
].join(', ');

const MODIFIER_KEYS: ReadonlySet<string> = new Set(['Shift', 'Control', 'Alt', 'Meta']);

export { CONTROL, KEEPS_FOCUS, MODIFIER_KEYS, OPTIONS_SUB_PANEL, OPTIONS_SUB_ROWS, TYPING, WIDGET_SCOPE };
