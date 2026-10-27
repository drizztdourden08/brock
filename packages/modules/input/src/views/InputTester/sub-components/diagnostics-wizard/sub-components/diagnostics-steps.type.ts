/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { DeviceProfile } from '../../../../../device-profile';
import type { ResolvedDevice } from '../../../../../family';
import type { DeviceEntry } from '../../../../../device.type';
import type { HidControllerMap } from '../../HidCalibrationWizard';
import type { FlashStatus } from '../../hid-calibration/hooks/flash-status.type';
import type { InputItem } from '../../hid-calibration/hid-calibration.type';
import type { CallInput, PositionalCaptureRecord } from '../positional-capture/positional-capture.type';
import type {
  ChooserDevice, DiagnosticsWizardState, HoldTransitionStatus, LayoutStage, NameLookupParams,
} from '../diagnostics-wizard.type';

interface ByteCaptureStepProps {
  releaseStatus: HoldTransitionStatus;
  deviceKey: string | null;
  initialProfile?: DeviceProfile | null;
  capturedEntry?: DeviceEntry | null;
  initialProfileId?: string;
  initialHasGyro: boolean;
  onCapturedCountChange: (count: number) => void;
  onComplete: (map: HidControllerMap) => void;
  onCancel: () => void;
}

type ByteCaptureSummaryProps = Pick<SummaryStepProps, 'byteCapture' | 'hasByteCapability'>;

interface ChooseControllerStepProps {
  devices: ChooserDevice[];
  addedNames: (params: NameLookupParams) => string | null;
  selectedDeviceKey: string | null;
  onSelect: (deviceKey: string) => void;
  selectedEntry: ChooserDevice | null;
  mapping: string | null;
  profile: DeviceProfile | null;
}

interface DiagnosticsStepActionsProps {
  wizard: DiagnosticsWizardState;
  cancelAction: ReactNode;
  introBack?: () => void;
  onByteCaptureNext: () => void;
  capturedCount: number;
}

interface BackNextActionsProps {
  cancelAction: ReactNode;
  onBack: () => void;
  onNext: () => void;
  backDisabled?: boolean;
  nextDisabled: boolean;
}

interface SummaryActionsProps {
  restartLabel: string;
  onRestart: () => void;
  saveStatus: FlashStatus;
  onSave: () => void;
  copyStatus: FlashStatus;
  onCopy: () => void;
}

interface FlashButtonProps {
  status: FlashStatus;
  onClick: () => void;
  labels: { idle: string; ok: string; error: string };
}

interface HoldStatusLineProps {
  status: HoldTransitionStatus;
  pendingText: string;
  doneText: string;
  errorText: string;
}

interface IntroStepProps {
  releaseStatus: HoldTransitionStatus;
}

interface LayoutCaptureOverlayProps {
  stage: LayoutStage;
  deviceName: string;
}

interface MatchedEntryPanelProps {
  entry: ChooserDevice;
  name: string;
  mapping: string | null;
  profile: DeviceProfile | null;
}

interface PositionalCaptureStepProps {
  restoreStatus: HoldTransitionStatus;
  deviceKey: string | null;
  resolvedDevice: ResolvedDevice | null;
  autoCapture: boolean;
  onAutoCaptureChange: (on: boolean) => void;
  onRecordsChange: (records: PositionalCaptureRecord[]) => void;
}

interface PositionalCaptureCellProps {
  item: InputItem;
  index: number;
  isCurrent: boolean;
  onSelect: (index: number) => void;
  onClear: (index: number) => void;
}

interface PositionalCaptureGridProps {
  items: InputItem[];
  activeIndex: number;
  inputPhaseActive: boolean;
  onSelect: (index: number) => void;
  onClear: (index: number) => void;
}

interface PositionalCaptureCallProps {
  call: CallInput;
}

interface PositionalSummaryTableProps {
  records: PositionalCaptureRecord[];
}

interface SummaryStepProps {
  byteCapture: HidControllerMap | null;
  hasByteCapability: boolean;
  positionalRecords: PositionalCaptureRecord[];
}

export type {
  BackNextActionsProps, ByteCaptureStepProps, ByteCaptureSummaryProps, ChooseControllerStepProps, DiagnosticsStepActionsProps, FlashButtonProps,
  HoldStatusLineProps, IntroStepProps, LayoutCaptureOverlayProps, MatchedEntryPanelProps,
  PositionalCaptureCallProps, PositionalCaptureCellProps, PositionalCaptureGridProps, PositionalCaptureStepProps,
  PositionalSummaryTableProps, SummaryActionsProps, SummaryStepProps,
};
