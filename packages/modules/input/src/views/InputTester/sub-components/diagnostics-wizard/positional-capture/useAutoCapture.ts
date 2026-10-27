/* @layer renderer-shell @kind hook */
import { useCallback, useEffect } from 'react';
import type { AutoCaptureParams } from './positional-capture.type';

const useAutoCapture = (params: AutoCaptureParams) => {
  const { session, actions, active, autoCapture, onAutoCaptureChange } = params;
  const { items, activeIndex, setAutoAdvanceWrapped, setInputPhaseActiveWrapped } = session;
  const { onStartButtons, onClickItem } = actions;

  useEffect(() => {
    if (active && autoCapture && items.length > 0 && activeIndex === -1) onStartButtons();
  }, [active, autoCapture, items.length, activeIndex, onStartButtons]);

  const onAutoCaptureToggle = useCallback((on: boolean) => {
    onAutoCaptureChange(on);
    if (!on) {
      setInputPhaseActiveWrapped(false);
      setAutoAdvanceWrapped(false);
      return;
    }
    const next = items.findIndex((item) => item.status !== 'captured' && item.status !== 'skipped');
    if (next >= 0) onClickItem(next);
  }, [onAutoCaptureChange, items, onClickItem, setAutoAdvanceWrapped, setInputPhaseActiveWrapped]);

  return { onAutoCaptureToggle };
};

export { useAutoCapture };
