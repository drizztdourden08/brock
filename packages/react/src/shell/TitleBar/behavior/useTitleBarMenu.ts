/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { MenuGroup } from '@drizztdourden08/tessera/composites';
import type { MenuEntry } from '../../../menu/menu.type';
import { useNavigation } from '../../../navigation/useNavigation';
import { titleBarGroups } from './title-bar-groups';

const useTitleBarMenu = (menu: readonly MenuEntry[]): MenuGroup[] => {
  const { open } = useNavigation();
  return useMemo(() => titleBarGroups(menu, { openScreen: open }), [menu, open]);
};

export { useTitleBarMenu };
