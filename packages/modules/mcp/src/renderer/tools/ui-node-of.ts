/* @layer renderer-shell @kind logic */
import type { McpData } from '../../mcp.type';
import { uiNameOf } from './ui-name-of';
import { uiRoleOf } from './ui-role-of';
import { uiValueOf } from './ui-value-of';

const disabledOf = (el: Element): boolean => ('disabled' in el && el.disabled === true) || el.getAttribute('aria-disabled') === 'true';

const checkedOf = (el: Element): boolean | undefined => {
  if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) return el.checked;
  const aria = el.getAttribute('aria-checked');
  return aria === 'true' || aria === 'false' ? aria === 'true' : undefined;
};

const uiNodeOf = (el: Element): McpData => {
  const rect = el.getBoundingClientRect();
  const checked = checkedOf(el);
  const value = uiValueOf(el);
  return {
    role: uiRoleOf(el),
    name: uiNameOf(el),
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    w: Math.round(rect.width),
    h: Math.round(rect.height),
    ...(disabledOf(el) ? { disabled: true } : {}),
    ...(checked !== undefined ? { checked } : {}),
    ...(value !== undefined ? { value } : {}),
  };
};

export { uiNodeOf };
