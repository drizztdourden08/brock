/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { firstFrameSignal } from './first-frame-signal';
import { useBootStore } from './useBootStore';
import { waitFrames } from './wait-frames';

const useFirstFrameSignal = (): void => {
  const phase = useBootStore((s) => s.phase);

  useEffect(() => {
    if (phase !== 'painting') return;
    void waitFrames(2).then(firstFrameSignal.resolve);
  }, [phase]);
};

export { useFirstFrameSignal };
