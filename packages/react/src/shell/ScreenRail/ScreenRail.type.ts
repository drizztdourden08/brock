/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { ScreenDef } from '../../screens/screen.type';

interface ScreenRailGroup {
  id: string;
  label: string;
}

interface ScreenRailProps {
  screens: readonly ScreenDef[];
  home: string;
  groups?: readonly ScreenRailGroup[];
  collapsed?: boolean;
  className?: string;
}

interface RailEntry {
  id: string;
  title: string;
  icon?: ReactNode;
  active: boolean;
  disabled: boolean;
}

interface RailGroup {
  id: string | null;
  label: string;
  entries: RailEntry[];
}

interface UseRailEntriesResult {
  groups: RailGroup[];
  select: (id: string) => void;
}

export type { RailEntry, RailGroup, ScreenRailGroup, ScreenRailProps, UseRailEntriesResult };
