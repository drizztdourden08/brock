/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { DeviceCardAction } from '../device-card-action.type';
import type { GlyphSource } from '../glyph-source.type';
import type { RumbleTest } from '../rumble-test.type';

interface ControllerHooksConfig {
  actions?: readonly DeviceCardAction[];
  rumbleTests?: readonly RumbleTest[];
  glyphSource?: GlyphSource;
}

interface ControllerReportState {
  deviceKey: string | null;
  open: (deviceKey: string) => void;
  close: () => void;
}

interface ControllerReportHostProps {
  children: ReactNode;
  renderDialog: (deviceKey: string, onClose: () => void) => ReactNode;
}

export type { ControllerHooksConfig, ControllerReportHostProps, ControllerReportState };
