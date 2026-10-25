/* @layer renderer-shell @kind types */
import type { DeviceEntry } from '../../../../../device.type';
import type { NativeCaptureStatus } from './native-captures.type';

interface BuildReportArgs {
  deviceKey: string;
  name: string;
  deviceEntry: DeviceEntry | null;
  preset: { id: string; name: string } | null;
  nativeStatus: NativeCaptureStatus;
  platform: string;
  appVersion: string;
}

export type { BuildReportArgs };
