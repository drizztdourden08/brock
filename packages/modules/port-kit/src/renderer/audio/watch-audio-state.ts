/* @layer renderer-shell @kind logic */
import { AUDIO_LOG_INTERVAL_MS } from './audio.constants';
import type { AudioWatchOptions } from './audio.type';
import { audioStateSnapshot } from './audio-state-snapshot';

const watchAudioState = (options: AudioWatchOptions): (() => void) => {
  const { output, log, isHeld } = options;
  const { context } = output;
  const report = (): void => log(audioStateSnapshot(output), 'info');
  const handleChange = (): void => {
    report();
    const dropped = context.state === 'suspended' || (context.state as string) === 'interrupted';
    if (dropped && !isHeld()) context.resume().catch(() => undefined);
  };
  context.addEventListener('statechange', handleChange);
  const timer = window.setInterval(report, AUDIO_LOG_INTERVAL_MS);
  return () => {
    context.removeEventListener('statechange', handleChange);
    window.clearInterval(timer);
  };
};

export { watchAudioState };
