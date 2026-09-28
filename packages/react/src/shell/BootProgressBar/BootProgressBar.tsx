/* @layer renderer-shell @kind component */
import { useEffect, useState } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { useBootProgressStore } from '../../stores/useBootProgressStore';
import { bootBarView } from './behavior/boot-bar-view';
import { FADE_MS, MIN_VISIBLE_MS } from './BootProgressBar.constants';
import './BootProgressBar.css';

const BootProgressBar = () => {
  const phase = useBootProgressStore((s) => s.phase);
  const message = useBootProgressStore((s) => s.message);
  const ratio = useBootProgressStore((s) => s.ratio);
  const [shownAt] = useState(() => performance.now());
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (phase !== 'ready') return;
    const remaining = Math.max(0, MIN_VISIBLE_MS - (performance.now() - shownAt));
    const timer = setTimeout(() => setFading(true), remaining);
    return () => clearTimeout(timer);
  }, [phase, shownAt]);

  useEffect(() => {
    if (!fading) return;
    const timer = setTimeout(() => setGone(true), FADE_MS);
    return () => clearTimeout(timer);
  }, [fading]);

  if (gone || phase === 'idle') return null;

  const { className, fillWidth } = bootBarView(phase, ratio, fading);

  return (
    <Box className={className} role="progressbar" aria-label={message || 'Loading'} aria-hidden={fading}>
      <Box className="boot-bar__label">{message}</Box>
      <Box className="boot-bar__fill" style={fillWidth ? { width: fillWidth } : undefined}>
        <Box className="boot-bar__label boot-bar__label--over">{message}</Box>
      </Box>
    </Box>
  );
};

export { BootProgressBar };
