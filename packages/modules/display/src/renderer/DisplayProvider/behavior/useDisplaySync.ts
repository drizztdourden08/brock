/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import { readDisplaySettings } from '../../read-display-settings';
import { useDisplayStore } from '../../useDisplayStore';

const useDisplaySync = (): void => {
  const { settings, hydrated } = useSettings<object>();
  const { windowMode, displayMonitor, syncedRateInFullscreen, syncedRateTargetHz } = readDisplaySettings(settings);
  const setSyncedPreference = useDisplayStore((s) => s.setSyncedPreference);
  const setWindowMode = useDisplayStore((s) => s.setWindowMode);
  const firstMode = useRef(true);

  useEffect(() => {
    if (hydrated) void setSyncedPreference(syncedRateInFullscreen, syncedRateTargetHz);
  }, [hydrated, setSyncedPreference, syncedRateInFullscreen, syncedRateTargetHz]);

  useEffect(() => {
    if (!hydrated) return;
    const initial = firstMode.current;
    firstMode.current = false;
    if (initial && windowMode === 'windowed' && !displayMonitor) return;
    void setWindowMode(windowMode, displayMonitor || null);
  }, [hydrated, setWindowMode, windowMode, displayMonitor]);
};

export { useDisplaySync };
