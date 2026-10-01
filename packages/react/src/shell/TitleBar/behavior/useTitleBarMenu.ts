/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { MenuGroup } from '@drizztdourden08/tessera/composites';
import type { MenuEntry } from '../../../menu/menu.type';
import { toMenuGroups } from '../../../menu/to-menu-groups';
import { useNavigation } from '../../../navigation/useNavigation';

const useTitleBarMenu = (menu: readonly MenuEntry[]): MenuGroup[] => {
  const { open } = useNavigation();
  return useMemo(() => toMenuGroups(menu, { openScreen: open }), [menu, open]);
};

export { useTitleBarMenu };
