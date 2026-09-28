/* @layer renderer-shell @kind types */
import type { TabRenderContext } from '@drizztdourden08/brock-react';
import type { DisplaySettings } from '../../display.type';

type DisplaySettingsTabProps = Pick<TabRenderContext<object>, 'settings' | 'onChange'>;

interface DisplaySectionProps {
  settings: DisplaySettings;
  onChange: (patch: Partial<DisplaySettings>) => void;
}

interface RateReadoutProps {
  currentHz: number | null;
}

interface ChangeRateDialogProps {
  open: boolean;
  targetHz: number;
  currentHz: number | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export type { DisplaySettingsTabProps, DisplaySectionProps, RateReadoutProps, ChangeRateDialogProps };
