/* @layer renderer-shell @kind hook */
import { useCallback, useMemo } from 'react';
import { useNavigation } from '../../../navigation/useNavigation';
import { useDeveloperTools } from '../../../app/useDeveloperTools';
import type { ScreenDef } from '../../../screens/screen.type';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { NO_GROUPS } from '../ScreenRail.constants';
import type { ScreenRailGroup, UseRailEntriesResult } from '../ScreenRail.type';
import { groupRail } from './group-rail';

const useRailEntries = (
  screens: readonly ScreenDef[],
  home: string,
  labels: readonly ScreenRailGroup[] = NO_GROUPS,
): UseRailEntriesResult => {
  const { active, open, close } = useNavigation();
  const profile = useProfilesStore((s) => s.active);
  const developerTools = useDeveloperTools();

  const config = useMemo(() => {
    const listed = screens.filter((screen) => !screen.devOnly || developerTools);
    return { groups: groupRail(listed, labels, profile !== null) };
  }, [screens, labels, profile, developerTools]);

  const select = useCallback((id: string) => {
    if (id === home) close();
    else open(id);
  }, [home, open, close]);

  return { config, activeId: active ?? home, select };
};

export { useRailEntries };
