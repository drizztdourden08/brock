/* @layer renderer-shell @kind constants */
const READ_UI_MAX_DEFAULT = 300;
const READ_UI_NAME_CHARS = 80;
const READ_UI_VALUE_CHARS = 200;

const READ_UI_ROLES: readonly string[] = [
  'button', 'link', 'tab', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'checkbox', 'radio', 'switch',
  'combobox', 'textbox', 'searchbox', 'slider', 'spinbutton', 'option', 'treeitem', 'heading',
];

const READ_UI_TAGS: readonly string[] = ['a[href]', 'button', 'input:not([type="hidden"])', 'select', 'textarea', 'summary', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', '[contenteditable="true"]'];

const READ_UI_SELECTOR = [...READ_UI_TAGS, ...READ_UI_ROLES.map((role) => `[role="${role}"]`)].join(',');

const READ_UI_TAG_ROLES: Readonly<Record<string, string>> = {
  a: 'link', button: 'button', select: 'combobox', textarea: 'textbox', summary: 'button',
  h1: 'heading', h2: 'heading', h3: 'heading', h4: 'heading', h5: 'heading', h6: 'heading',
};

const READ_UI_INPUT_ROLES: Readonly<Record<string, string>> = {
  checkbox: 'checkbox', radio: 'radio', range: 'slider', number: 'spinbutton', search: 'searchbox',
  button: 'button', submit: 'button', reset: 'button',
};

const READ_UI_NO_VALUE_TYPES: readonly string[] = ['password', 'checkbox', 'radio', 'button', 'submit', 'reset', 'file'];
const READ_UI_SECRET_AUTOCOMPLETE: readonly string[] = ['current-password', 'new-password', 'one-time-code', 'cc-'];

export {
  READ_UI_MAX_DEFAULT, READ_UI_NAME_CHARS, READ_UI_VALUE_CHARS, READ_UI_SELECTOR, READ_UI_TAG_ROLES,
  READ_UI_INPUT_ROLES, READ_UI_NO_VALUE_TYPES, READ_UI_SECRET_AUTOCOMPLETE,
};
