/* @layer renderer-shell @kind logic */
import type { DeviceCardAction } from '../device-card-action.type';
import { REPORT_ACTION_ID } from '../input-renderer.constants';
import { REPORT_ACTION_LABEL } from './controller-hooks.constants';
import { useControllerReportStore } from './useControllerReportStore';

const reportDeviceCardAction = (label: string = REPORT_ACTION_LABEL): DeviceCardAction => ({
  id: REPORT_ACTION_ID,
  label,
  icon: 'bug',
  variant: 'ghost',
  onSelect: (entry) => useControllerReportStore.getState().open(entry.deviceKey),
});

export { reportDeviceCardAction };
