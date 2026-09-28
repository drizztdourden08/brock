/* @layer renderer-shell @kind logic */
import type { CoreCalls, SampleAudio } from '../../port/port-definition.type';
import type { AudioAdapter } from '../audio/audio.type';
import { pcm16ToFloat } from '../audio/pcm16-to-float';
import type { GameCore } from '../core/game-core.type';
import type { FrameLoop, FramePresenter } from './frame.type';
import { DEFAULT_FPS } from './frame.constants';
import { createFrameLoop } from './create-frame-loop';

const pushAudio = (calls: CoreCalls, audio: SampleAudio, adapter: AudioAdapter): void => {
  const frames = calls.number(audio.count);
  if (frames <= 0) return;
  const samples = pcm16ToFloat(calls.heap(), calls.number(audio.samples), frames * audio.channels);
  adapter.pushSamples({ samples, channels: audio.channels, sampleRate: audio.sampleRate });
};

const createHostLoop = (core: GameCore, presenter: FramePresenter, adapter: AudioAdapter): FrameLoop | null => {
  const { video, audio, core: coreDef } = core.definition;
  const { runFrame } = coreDef.exports;
  if (!runFrame) return null;

  const step = (): void => {
    const calls = core.calls();
    if (!calls || core.state().status !== 'running') return;
    calls.call(runFrame);
    if (audio.mode === 'samples') pushAudio(calls, audio, adapter);
  };

  const afterSteps = (): void => {
    const calls = core.calls();
    if (!calls || video.mode !== 'framebuffer') return;
    const pointer = calls.number(video.frame);
    presenter.present(calls.heap().subarray(pointer, pointer + video.width * video.height * 4));
  };

  const fps = video.mode === 'framebuffer' ? video.fps ?? DEFAULT_FPS : DEFAULT_FPS;
  return createFrameLoop({ fps, step, afterSteps });
};

export { createHostLoop };
