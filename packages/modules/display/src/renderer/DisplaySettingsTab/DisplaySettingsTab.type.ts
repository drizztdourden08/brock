/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { TabRenderContext } from '@drizztdourden08/brock-react';
import type { DisplaySettings, SyncedRateStatus } from '../../display.type';

type DisplaySettingsTabProps = Pick<TabRenderContext<object>, 'settings' | 'onChange'>;

interface DisplaySectionProps {
  settings: DisplaySettings;
  onChange: (patch: Partial<DisplaySettings>) => void;
}

type DisplaySectionId = 'window' | 'refreshRate';

type DisplayRowId = 'windowMode' | 'displayMonitor' | 'detectedRate' | 'syncedRateInFullscreen' | 'syncedRateTargetHz' | 'changeRate';

interface DisplaySectionCopy {
  title: string;
  description: string;
}

interface DisplayRowCopy {
  label: string;
  description: string;
  hint: string;
  keywords: string;
}

interface RateReadoutProps {
  currentHz: number | null;
}

interface RefreshRateRowsInput {
  settings: DisplaySettings;
  status: SyncedRateStatus;
  selected: number;
  readout: ReactNode;
  changeButton: ReactNode;
  onSynced: (on: boolean) => void;
  onTarget: (value: string) => void;
}

interface ChangeRateDialogProps {
  open: boolean;
  targetHz: number;
  currentHz: number | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export type { DisplaySettingsTabProps, DisplaySectionProps, DisplaySectionId, DisplayRowId, DisplaySectionCopy, DisplayRowCopy, RateReadoutProps, RefreshRateRowsInput, ChangeRateDialogProps };
