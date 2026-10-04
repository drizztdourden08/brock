/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { nextWindowGroup } from './next-window-group';
import { useMainWindowGroup } from './useMainWindowGroup';
import { WINDOW_GROUP_ACTION_ID, WINDOW_GROUP_TEXT, WINDOW_GROUPS } from './window-groups.constants';

const useWindowGroupTitleAction = (enabled: boolean): WindowTitleBarAction | null => {
  const { group, setGroup } = useMainWindowGroup();
  return useMemo(() => {
    if (!enabled) return null;
    const label = WINDOW_GROUPS.find((option) => option.id === group)?.label ?? WINDOW_GROUP_TEXT.none;
    return {
      id: WINDOW_GROUP_ACTION_ID,
      label: WINDOW_GROUP_TEXT.group,
      icon: 'group',
      bar: 'menu',
      status: label,
      onSelect: () => setGroup(nextWindowGroup(group, WINDOW_GROUPS)),
    };
  }, [enabled, group, setGroup]);
};

export { useWindowGroupTitleAction };
