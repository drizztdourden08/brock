/* @layer renderer-shell @kind logic */
import type { AudioAdapter, AudioAdapterOptions, AudioOutput, SampleBlock } from './audio.type';
import { armGestureResume } from './arm-gesture-resume';
import { audioStateSnapshot } from './audio-state-snapshot';
import { scheduleSamples } from './schedule-samples';
import { watchAudioState } from './watch-audio-state';

const createAudioAdapter = (initialVolume = 100, options: AudioAdapterOptions = {}): AudioAdapter => {
  const { leadS, log = () => undefined } = options;
  let volume = initialVolume;
  let out: AudioOutput | null = null;
  let owned = false;
  let nextTime = 0;
  let disarm: (() => void) | null = null;
  let unwatch: (() => void) | null = null;
  let held = false;
  let reported = false;

  const wire = (context: AudioContext): AudioOutput => {
    const gain = context.createGain();
    gain.gain.value = volume / 100;
    gain.connect(context.destination);
    disarm = armGestureResume(context);
    out = { context, node: gain };
    unwatch?.();
    unwatch = watchAudioState({ output: out, log, isHeld: () => held });
    return out;
  };

  const attachNode = (context: AudioContext, node: AudioNode): void => {
    const target = out?.context === context ? out : wire(context);
    node.disconnect();
    node.connect(target.node);
  };

  const pushSamples = (block: SampleBlock): void => {
    if (!out) {
      owned = true;
      wire(new AudioContext({ sampleRate: block.sampleRate }));
    }
    if (out && !reported) {
      reported = true;
      log(audioStateSnapshot(out), 'info');
    }
    if (out) nextTime = scheduleSamples(out, block, nextTime, leadS);
  };

  const setVolume = (percent: number): void => {
    volume = percent;
    if (out?.node instanceof GainNode) out.node.gain.value = percent / 100;
  };

  const suspend = (): void => {
    held = true;
    void out?.context.suspend();
  };

  const resume = (): void => {
    held = false;
    void out?.context.resume();
  };

  const dispose = (): void => {
    disarm?.();
    disarm = null;
    unwatch?.();
    unwatch = null;
    held = false;
    reported = false;
    if (out && owned) void out.context.close().catch(() => undefined);
    out = null;
    owned = false;
    nextTime = 0;
  };

  return { attachNode, pushSamples, setVolume, output: () => out, suspend, resume, dispose };
};

export { createAudioAdapter };
