/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface ControllerDisconnectOverlayProps {
  controllerName: string;
  canSwitchProfile: boolean;
  onResume: () => void;
  resumeGlyph?: ReactNode;
  prevGlyph?: ReactNode;
  nextGlyph?: ReactNode;
}

export type { ControllerDisconnectOverlayProps };
