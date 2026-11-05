/* @layer renderer-shell @kind component */
import { useEffect, useState } from 'react';
import { Text } from '@drizztdourden08/tessera/primitives';
import type { RecordingTimerProps } from './RecordingTimer.type';
import './RecordingTimer.css';

const clock = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

const RecordingTimer = ({ startedAt }: RecordingTimerProps) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  return <Text className="recording-timer">{clock(now - startedAt)}</Text>;
};

export { RecordingTimer };
