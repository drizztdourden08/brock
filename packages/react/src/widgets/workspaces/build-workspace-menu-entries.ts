/* @layer renderer-shell @kind logic */
import { fallbackText } from '../../i18n/fallback-text';
import type { MenuItem } from '../../menu/menu.type';
import { byOrder } from '../../screens/conventions/by-order';
import { UNORDERED } from '../../screens/conventions/screens.constants';
import { WORKSPACE_KEY_PREFIX, WORKSPACE_MENU, WORKSPACE_WORDS } from './workspace.constants';
import type { WorkspaceMenuInput } from './build-workspace-menu-entries.type';

const buildWorkspaceMenuEntries = ({ defs, active, activate, reset, text = fallbackText }: WorkspaceMenuInput): MenuItem[] => {
  if (defs.length === 0) return [];
  const sorted = defs.map((def) => ({ def, order: def.order ?? UNORDERED, label: def.label })).sort(byOrder).map(({ def }) => def);
  const choices = sorted.map((def): MenuItem => ({
    key: `${WORKSPACE_KEY_PREFIX}${def.id}`,
    label: def.label,
    checked: active === def.id,
    onClick: () => activate(def.id),
  }));
  return [{
    ...WORKSPACE_MENU,
    label: text(WORKSPACE_MENU.label),
    children: [
      { key: `${WORKSPACE_KEY_PREFIX}base`, label: text(WORKSPACE_WORDS.base), checked: active === null, onClick: () => activate(null) },
      ...choices,
      'separator',
      { key: `${WORKSPACE_KEY_PREFIX}reset`, label: text(WORKSPACE_WORDS.reset), icon: 'rotate-ccw', confirm: true, onClick: () => reset() },
    ],
  }];
};

export { buildWorkspaceMenuEntries };
