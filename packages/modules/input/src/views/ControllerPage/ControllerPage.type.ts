/* @layer renderer-components @kind types */
import type { DeviceEntry } from '../../device.type';
import type { DeviceStickCalibration, TriggerCalibration } from '../../calibration.type';
import type { PadState } from '../../pad/controller-slot.type';
import type { ControllerInputState } from '../../runtime/controller-input-store.type';
import type { ResolvedControl, ResolvedDevice } from '../../family';
import type { StickPairGroup } from '../../resolved-axis-groups/resolved-axis-groups.type';
import type { ControllerSilhouetteAnchorSet } from '@drizztdourden08/tessera/composites';
import type { OverlaySlotView, PadOverlayState } from '../../composites/PadOverlay';
import type { PositionIcons } from '../../pad-overlay/pad-overlay.type';
import type { DeviceCardAction } from '../../renderer/device-card-action.type';
import type { RumbleTest } from '../../renderer/rumble-test.type';

interface ControllerPageProps {
  deviceKey: string;
  onRunDiagnostics?: (deviceKey: string) => void;
}

interface PadNavEntry {
  id: string;
  label: string;
  connected: boolean;
}

interface PadOverlayModel {
  outline: string;
  anchors: ControllerSilhouetteAnchorSet;
  slots: readonly OverlaySlotView[];
  icons: PositionIcons;
}

interface ControllerCalibration {
  existingStickCal: DeviceStickCalibration | null;
  onStickComplete: (calibration: DeviceStickCalibration) => void;
  onTriggerComplete: (axisIndex: number, calibration: TriggerCalibration) => void;
}

interface ControllerPageModel {
  deviceKey: string;
  entry: DeviceEntry;
  name: string;
  idLabel: string;
  brandIcon: string | null;
  resolved: ResolvedDevice | null;
  adapterPort: number | null;
  state: ControllerInputState;
  pad: PadState;
  overlay: PadOverlayModel | null;
  overlayState: PadOverlayState;
  calibration: ControllerCalibration;
  addMapping: (mapping: string) => Promise<boolean>;
}

interface BoxProps {
  page: ControllerPageModel;
}

interface InfoBoxProps extends BoxProps {
  onRunDiagnostics: ((deviceKey: string) => void) | undefined;
}

type CalibrationTarget =
  | { type: 'stick'; side: 'left' | 'right' | 'both' }
  | { type: 'trigger'; axisIndex: number; label: string }
  | null;

interface RumbleTestButtonProps {
  deviceKey: string;
  test: RumbleTest;
  disabled: boolean;
}

interface CardCalibrationProps {
  deviceKey: string;
  target: CalibrationTarget;
  existingStickCal: DeviceStickCalibration | null;
  onClose: () => void;
  onStickComplete: (calibration: DeviceStickCalibration) => void;
  onTriggerComplete: (axisIndex: number, calibration: TriggerCalibration) => void;
}

interface AxisActionsProps {
  label: string;
  getValues: () => number[];
  onCalibrate: () => void;
}

interface PadActionsProps {
  entry: DeviceEntry;
  onRunDiagnostics: ((deviceKey: string) => void) | undefined;
}

interface PadActionButtonProps {
  action: DeviceCardAction;
  disabled: boolean;
  entry: DeviceEntry;
}

interface RumbleTestsProps {
  deviceKey: string;
  hasRumble: boolean;
}

interface StickReadoutProps {
  pair: StickPairGroup;
  pairIdx: number;
  state: ControllerInputState;
  onCalibrate: (target: CalibrationTarget) => void;
}

interface TriggerReadoutProps {
  trigger: ResolvedControl;
  state: ControllerInputState;
  onCalibrate: (target: CalibrationTarget) => void;
}

export type {
  AxisActionsProps, BoxProps, InfoBoxProps, CalibrationTarget, CardCalibrationProps, ControllerCalibration, ControllerPageModel, ControllerPageProps, PadOverlayModel,
  PadActionButtonProps, PadActionsProps, PadNavEntry, RumbleTestButtonProps, RumbleTestsProps, StickReadoutProps, TriggerReadoutProps,
};
