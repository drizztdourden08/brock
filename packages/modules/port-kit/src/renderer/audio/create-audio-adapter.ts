/* @layer renderer-shell @kind logic */
import type { AudioAdapter, AudioOutput, SampleBlock } from './audio.type';
import { armGestureResume } from './arm-gesture-resume';
import { scheduleSamples } from './schedule-samples';

const createAudioAdapter = (initialVolume = 100): AudioAdapter => {
  let volume = initialVolume;
  let out: AudioOutput | null = null;
  let owned = false;
  let nextTime = 0;
  let disarm: (() => void) | null = null;

  const wire = (context: AudioContext): AudioOutput => {
    const gain = context.createGain();
    gain.gain.value = volume / 100;
    gain.connect(context.destination);
    disarm = armGestureResume(context);
    out = { context, node: gain };
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
    if (out) nextTime = scheduleSamples(out.context, out.node, block, nextTime);
  };

  const setVolume = (percent: number): void => {
    volume = percent;
    if (out?.node instanceof GainNode) out.node.gain.value = percent / 100;
  };

  const dispose = (): void => {
    disarm?.();
    disarm = null;
    if (out && owned) void out.context.close().catch(() => undefined);
    out = null;
    owned = false;
    nextTime = 0;
  };

  return {
    attachNode,
    pushSamples,
    setVolume,
    output: () => out,
    suspend: () => void out?.context.suspend(),
    resume: () => void out?.context.resume(),
    dispose,
  };
};

export { createAudioAdapter };
