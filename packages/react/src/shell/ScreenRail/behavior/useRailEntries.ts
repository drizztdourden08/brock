/* @layer renderer-shell @kind hook */
import { useCallback, useMemo } from 'react';
import { useText } from '../../../i18n';
import { useNavigation } from '../../../navigation/useNavigation';
import { useDeveloperTools } from '../../../app/useDeveloperTools';
import type { ScreenDef } from '../../../screens/screen.type';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { isShown } from '../../../screens/show/is-shown';
import { useShowContext } from '../../../screens/show/useShowContext';
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
  const show = useShowContext();
  const text = useText();

  const config = useMemo(() => {
    const listed = screens.filter((screen) => (!screen.devOnly || developerTools) && isShown(screen.show, show));
    return { groups: groupRail(listed, labels, profile !== null, text) };
  }, [screens, labels, profile, developerTools, show, text]);

  const select = useCallback((id: string) => {
    if (id === home) close();
    else open(id);
  }, [home, open, close]);

  return { config, activeId: active ?? home, select };
};

export { useRailEntries };
