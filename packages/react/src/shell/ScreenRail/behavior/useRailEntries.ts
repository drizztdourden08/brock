/* @layer renderer-shell @kind hook */
import { useCallback, useMemo } from 'react';
import { useNavigation } from '../../../navigation/useNavigation';
import { usePlatform } from '../../../platform/usePlatform';
import type { ScreenDef } from '../../../screens/screen.type';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { NO_GROUPS } from '../ScreenRail.constants';
import type { RailGroup, ScreenRailGroup, UseRailEntriesResult } from '../ScreenRail.type';

const groupRail = (
  screens: readonly ScreenDef[],
  labels: readonly ScreenRailGroup[],
  activeId: string,
  hasProfile: boolean,
): RailGroup[] => {
  const ungrouped: RailGroup = { id: null, label: '', entries: [] };
  const grouped: RailGroup[] = [];
  for (const screen of screens) {
    const entry = {
      id: screen.id,
      title: screen.title,
      icon: screen.icon,
      active: screen.id === activeId,
      disabled: screen.requiresProfile !== false && !hasProfile,
    };
    if (screen.group === undefined) { ungrouped.entries.push(entry); continue; }
    const found = grouped.find((g) => g.id === screen.group);
    if (found) { found.entries.push(entry); continue; }
    const label = labels.find((g) => g.id === screen.group)?.label ?? screen.group;
    grouped.push({ id: screen.group, label, entries: [entry] });
  }
  return ungrouped.entries.length > 0 ? [ungrouped, ...grouped] : grouped;
};

const useRailEntries = (
  screens: readonly ScreenDef[],
  home: string,
  labels: readonly ScreenRailGroup[] = NO_GROUPS,
): UseRailEntriesResult => {
  const { active, open, close } = useNavigation();
  const profile = useProfilesStore((s) => s.active);
  const { info } = usePlatform();

  const groups = useMemo(() => {
    const listed = screens.filter((screen) => !screen.devOnly || info.isDev);
    return groupRail(listed, labels, active ?? home, profile !== null);
  }, [screens, labels, active, home, profile, info.isDev]);

  const select = useCallback((id: string) => {
    if (id === home) close();
    else open(id);
  }, [home, open, close]);

  return { groups, select };
};

export { useRailEntries };
