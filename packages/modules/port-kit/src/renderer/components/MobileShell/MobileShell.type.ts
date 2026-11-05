/* @layer renderer-shell @kind types */
import type { MenuEntry } from '@drizztdourden08/brock-react';

type BackStep = 'close' | 'open' | 'escape' | 'home';

interface MobileShellProps {
  extraEntries?: readonly MenuEntry[];
  fps?: number;
  label?: string;
}

interface MobileMenuDrawerProps {
  entries: readonly MenuEntry[];
  fps: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onPick: (entry: MenuEntry) => void;
}

export type { BackStep, MobileMenuDrawerProps, MobileShellProps };
