/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { Text } from '@drizztdourden08/brock-core/i18n';
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
  title: Text;
  description: Text;
}

interface DisplayRowCopy {
  label: Text;
  description: Text;
  hint: Text;
  keywords: Text;
}

interface WindowModeCopy {
  value: string;
  label: Text;
  hint: Text;
}

interface RateReadoutProps {
  currentHz: number | null;
}

interface RefreshRateRowsInput {
  text: (value: Text) => string;
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

export type { DisplaySettingsTabProps, DisplaySectionProps, DisplaySectionId, DisplayRowId, DisplaySectionCopy, DisplayRowCopy, RateReadoutProps, RefreshRateRowsInput, ChangeRateDialogProps, WindowModeCopy };
