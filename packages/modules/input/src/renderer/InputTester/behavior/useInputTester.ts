/* @layer renderer-shell @kind hook */
import { useCallback, useEffect } from 'react';
import { useCalibrationStore } from '../../useCalibrationStore';
import { useControllerDevicesStore } from '../../useControllerDevicesStore';
import { statusLine } from './status-line';

const useInputTester = () => {
  const { entries, status, loaded, rescanPending, refresh, rescan } = useControllerDevicesStore();
  const refreshCalibration = useCalibrationStore((s) => s.refresh);

  useEffect(() => {
    void refresh();
    void refreshCalibration();
  }, [refresh, refreshCalibration]);

  const handleRescan = useCallback(() => { void rescan(); }, [rescan]);

  return {
    entries,
    available: status.available,
    loaded,
    rescanPending,
    handleRescan,
    subtitle: statusLine(loaded, status, entries.length),
  };
};

export { useInputTester };
