/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface ProfileSwitcherEntry {
  id: string;
  name: string;
  deviceType?: string;
}

interface ProfileSwitcherOverlayProps {
  open: boolean;
  profiles: readonly ProfileSwitcherEntry[];
  activeId: string | null;
  prevGlyph?: ReactNode;
  nextGlyph?: ReactNode;
}

export type { ProfileSwitcherEntry, ProfileSwitcherOverlayProps };
