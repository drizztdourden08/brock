/* @layer renderer-shell @kind barrel */
import '../augment';
import type { RendererModule } from '@drizztdourden08/brock-react';
import { controllerInputBootTask } from '../controller-input/controller-input-boot-task';
import { InputProvider } from './InputProvider';
import { controllersBucket } from './controllers-bucket';

const inputRenderer: RendererModule = {
  id: 'input',
  buckets: [controllersBucket],
  menu: [{ key: 'controllers', label: 'Controllers', icon: 'gamepad-2', section: 'advanced', screen: 'controllers' }],
  Provider: InputProvider,
  bootTasks: [controllerInputBootTask],
};

export default inputRenderer;
export { inputRenderer, InputProvider };
export { inputApi } from './input-api';
export { isInputAvailable } from './is-input-available';
export { noopInputApi } from '../noop-input-api';
export { registerDeviceCardActions } from './register-device-card-actions';
export { useDeviceCardActions } from './useDeviceCardActions';
export type { DeviceCardAction } from './device-card-action.type';
export { registerRumbleTests } from './register-rumble-tests';
export type { RumbleTest } from './rumble-test.type';
export { registerGlyphSource } from './register-glyph-source';
export type { GlyphSource } from './glyph-source.type';
export { CONTROLLER_SLOT_IDS } from '../pad/controller-slot-ids.constants';
export type { ControllerExtra } from '../pad/controller-slot.type';
export { PadOverlay } from '../composites/PadOverlay';
export type { OverlaySlotView, PadOverlayState } from '../composites/PadOverlay';
export { DpadCross } from '../composites/DpadCross';
export { SvgImage } from '../primitives/SvgImage';
export { padLivePages } from '../views/ControllerPage';
export { StickPlot } from '../compounds/StickPlot';
export type { StickPlotPoint, StickPlotProps, StickPlotRange, StickPlotSize } from '../compounds/StickPlot';
export { PressedGrid } from '../compounds/PressedGrid';
export type { PressedGridItem, PressedGridProps } from '../compounds/PressedGrid';
export { useControllerDevicesStore } from './useControllerDevicesStore';
export type { ControllerDevicesStore } from './controller-devices-store.type';
export { useControllerStateStore } from './useControllerStateStore';
export { useControllerState } from './useControllerState';
export { usePadState } from './usePadState';
export { padFamilyOf } from '../pad/pad-family-of';
export { padStateOf } from '../pad/pad-state-of';
export type {
  ControllerSlotId, ControllerSlotState, PadSlotState, PadSlots, PadExtra, PadState, PadFamily, PadDevice, PadStateListener,
} from '../pad/controller-slot.type';
export type { ControllerLiveState, ControllerStateStore } from './controller-state-store.type';
export { useCalibrationStore } from './useCalibrationStore';
export type { CalibrationState } from './calibration-store.type';
export { SDL_BUTTON_NAMES, SDL_AXIS_NAMES, SDL_AXIS } from '../input.constants';
export { applyStickCalibration } from '../calibration/apply-stick-calibration';
export { applyTriggerCalibration } from '../calibration/apply-trigger-calibration';
export type { InputApi, InputCalibrationApi, InputCaptureApi, InputMappingApi } from '../input-api.type';
export type { DeviceEntry, InputStatus, VibrateSegment, VibrateResult } from '../device.type';
export type { DeviceStickCalibration, TriggerCalibration, StickPoint } from '../calibration.type';
export { controllerInputStore } from '../controller-input/controller-input-store';
export type { ControllerInputState, HidRawReportEvent } from '../controller-input/controller-input-store';
export { DIAG_LOG_MAX } from '../runtime/controller-input-store.constants';
export type {
  ControllerDiagListener, ControllerDisconnectListener, HidRawReportListener,
} from '../runtime/controller-input-store.type';
export type { ControllerStateHost } from '../runtime/process-controller-state.type';
export { controllerCardInfo } from '../runtime/controller-card-info';
export { groupControllerDevices } from '../runtime/controller-device-groups';
export type { ControllerDeviceGroup } from '../runtime/controller-device-groups';
export { cellAt, itemAt } from '../checked-access';
export { recallControllerSdlType } from '../runtime/controller-family-cache';
export { rememberControllerSdlType } from '../runtime/controller-family-cache/remember-controller-sdl-type';
export { recallControllerName } from '../runtime/controller-name-cache/recall-controller-name';
export { rememberControllerName } from '../runtime/controller-name-cache/remember-controller-name';
export { resolveDeviceFromEntry } from '../runtime/resolve-device';
export type { DeviceSnapshotFields } from '../runtime/seed-device-cache.type';
export { padDisplayName } from '../controller-names/pad-display-name';
export { ANALOG_POSITIONS, SLOT_POSITIONS } from '../controller-families/controller-families.constants';
export { layoutFamilyOf } from '../controller-families/layout-family-of';
export type { DevicePositions, LayoutFamily } from '../controller-families/controller-families.type';
export { groupAxisControls } from '../resolved-axis-groups/group-axis-controls';
export type { GroupedAxisControls, StickPairGroup } from '../resolved-axis-groups/resolved-axis-groups.type';
export { useControllerEventLog } from '../controller-event-log/useControllerEventLog';
export { useControllerDevices } from './useControllerDevices';
export { useAppVersion } from './useAppVersion';
export { ControllerStatusBar } from '../compounds/ControllerStatusBar';
export { ControllerPortRow } from '../compounds/ControllerPortRow';
export { ControllerStatusBadge } from '../compounds/ControllerStatusBadge';
export { ControllerCapabilityBadges } from '../compounds/ControllerCapabilityBadges';
export { UnavailableControllerNotice } from '../compounds/UnavailableControllerNotice';
export { MappingPasteBox } from '../compounds/MappingPasteBox';
export { RescanButton } from '../compounds/RescanButton';
export { StepIndicator } from '../views/InputTester/sub-components/controller-report/sub-components/StepIndicator';
export { ReportSection } from '../views/InputTester/sub-components/controller-report/sub-components/ReportSection';
export type {
  DetectionContext, FiledControllerReport, ReportSectionProps, ReportStep, StepIndicatorProps, SubmitStatus,
} from '../views/InputTester/sub-components/controller-report/controller-report.type';
export { buildReport } from '../views/InputTester/sub-components/hid-calibration/diagnostics/report-builder';
export type { GamepadDiagnosticsReport } from '../views/InputTester/sub-components/hid-calibration/diagnostics';
export { useDiagnosticsWizardState } from '../views/InputTester/sub-components/diagnostics-wizard/behavior/useDiagnosticsWizardState';
export type { DiagnosticsWizardState } from '../views/InputTester/sub-components/diagnostics-wizard/behavior/useDiagnosticsWizardState';
export { useSummaryExport } from '../views/InputTester/sub-components/diagnostics-wizard/behavior/useSummaryExport';
export { useFlashStatus } from '../views/InputTester/sub-components/hid-calibration/hooks/useFlashStatus';
export { COPY_LABELS } from '../views/InputTester/sub-components/diagnostics-wizard/diagnostics-wizard.constants';
export { DiagnosticsStepActions } from '../views/InputTester/sub-components/diagnostics-wizard/sub-components/DiagnosticsStepActions';
export { FlashButton } from '../views/InputTester/sub-components/diagnostics-wizard/sub-components/FlashButton';
export { DiagnosticsFlowBody } from '../views/InputTester/sub-components/diagnostics-wizard/DiagnosticsFlowBody';
export type { HidControllerMap } from '../views/InputTester/sub-components/HidCalibrationWizard';
export type { HidWizardHandle } from '../views/InputTester/sub-components/HidCalibrationWizard.type';
export type { PositionalCaptureRecord } from '../views/InputTester/sub-components/diagnostics-wizard/positional-capture/positional-capture.type';
export { ControllerDirectory } from '../views/ControllerDirectory';
export { ControllerLogs } from '../views/ControllerLogs';
export { ControllerDiagnostics } from '../views/ControllerDiagnostics';
