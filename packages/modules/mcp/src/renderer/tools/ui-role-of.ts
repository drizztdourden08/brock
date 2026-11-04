/* @layer renderer-shell @kind logic */
import { READ_UI_INPUT_ROLES, READ_UI_TAG_ROLES } from './read-ui.constants';

const uiRoleOf = (el: Element): string => {
  const explicit = el.getAttribute('role')?.trim().split(/\s+/)[0];
  if (explicit !== undefined && explicit !== '') return explicit;
  const tag = el.tagName.toLowerCase();
  if (tag === 'input') return READ_UI_INPUT_ROLES[(el as HTMLInputElement).type] ?? 'textbox';
  return READ_UI_TAG_ROLES[tag] ?? (el.getAttribute('contenteditable') === 'true' ? 'textbox' : 'generic');
};

export { uiRoleOf };
