/* @layer renderer-shell @kind logic */
import { attachSdlAudio } from '../audio/attach-sdl-audio';
import { createFramePresenter } from '../frame/create-frame-presenter';
import { createHostLoop } from '../frame/create-host-loop';
import { createSramSync } from '../saves/create-sram-sync';
import type { AttachRequest, SessionParts } from './port-session.type';

const attachSessionParts = ({ core, canvas, audio, sram, profileId }: AttachRequest): SessionParts => {
  const { video, saves } = core.definition;
  const presenter = createFramePresenter(canvas, video.mode === 'framebuffer' ? video : null);
  const mod = core.module();
  const detachAudio = mod && core.definition.audio.mode === 'emscripten-sdl' ? attachSdlAudio(mod, audio) : () => undefined;
  const loop = createHostLoop(core, presenter, audio);
  loop?.start();
  const sync = profileId ? createSramSync({ core, store: sram, profileId, intervalMs: saves.sramSyncMs }) : null;
  sync?.start();
  return { presenter, loop, sram: sync, detachAudio };
};

export { attachSessionParts };
