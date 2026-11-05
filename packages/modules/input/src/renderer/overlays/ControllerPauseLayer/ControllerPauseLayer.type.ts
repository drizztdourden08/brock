/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

type PauseChangeListener = (paused: boolean, controllerName: string) => void;

interface ControllerPauseSource {
  onPauseChange: (listener: PauseChangeListener) => () => void;
  checkControllerPresence: () => void;
}

type PauseOverlayKind = 'none' | 'manual' | 'disconnect';

interface ControllerPauseLayerProps {
  status: string;
  source: ControllerPauseSource;
  canSwitchProfile: boolean;
  onResume: () => void;
  resumeGlyph?: ReactNode;
  prevGlyph?: ReactNode;
  nextGlyph?: ReactNode;
  manualPauseName?: string;
  presenceDelayMs?: number;
}

interface PauseState {
  controllerPaused: boolean;
  disconnectedName: string;
}

export type { ControllerPauseLayerProps, ControllerPauseSource, PauseChangeListener, PauseOverlayKind, PauseState };
