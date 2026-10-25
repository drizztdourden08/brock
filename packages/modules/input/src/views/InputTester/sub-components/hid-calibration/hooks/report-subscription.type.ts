/* @layer renderer-shell @kind types */
import type { ControllerInputState, HidRawReportEvent } from '../../../../../controller-input/controller-input-store';
import type { ButtonCallbacks } from '../button-detection/button-detection.type';
import type { useCalibrationRefs } from './useCalibrationRefs';

type CalibrationRefs = ReturnType<typeof useCalibrationRefs>;

interface ReportSubscriptionCallbacks extends ButtonCallbacks {
  setLatestBytes: (bytes: Uint8Array) => void;
  setLiveParsedState: (state: ControllerInputState) => void;
  setGyroChangedBytes: (changed: Set<number>) => void;
  setStickLiveInfo: (info: string) => void;
  setStickBusy: (v: boolean) => void;
  setTriggerLiveInfo: (info: string) => void;
  setTriggerBusy: (v: boolean) => void;
}

interface DispatchRawReportParams {
  report: HidRawReportEvent;
  deviceKey: string | undefined;
  refs: CalibrationRefs;
  cb: ReportSubscriptionCallbacks;
}

export type { CalibrationRefs, DispatchRawReportParams, ReportSubscriptionCallbacks };
