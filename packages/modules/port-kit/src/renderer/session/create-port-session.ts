/* @layer renderer-shell @kind logic */
import { createAssetCache } from '../../assets/create-asset-cache';
import { createRomStore } from '../../rom/create-rom-store';
import { createSaveStore } from '../../saves/create-save-store';
import { createAudioAdapter } from '../audio/create-audio-adapter';
import { createSaveSlots } from '../saves/create-save-slots';
import { createLiveSettings } from '../settings/create-live-settings';
import type { PortSession, PortSessionOptions, SessionParts } from './port-session.type';
import { attachSessionParts } from './attach-session-parts';

const createPortSession = <S>(options: PortSessionOptions<S>): PortSession<S> => {
  const { core, canvas, files, romFile, profileId = null, settings: initial, config, volume, extraFiles, log } = options;
  const audio = createAudioAdapter(volume);
  const settings = createLiveSettings(core);
  const store = createSaveStore(files);
  const roms = createRomStore(files, core.definition);
  let parts: SessionParts | null = null;

  const start = async (): Promise<boolean> => {
    const assets = await createAssetCache(files, roms, core.definition).load(romFile, options.onAssetProgress);
    const sram = profileId ? await store.sram.read(profileId) : null;
    await core.start({ assets, canvas, config, sram, extraFiles, log });
    if (core.state().status !== 'running') return false;
    parts = attachSessionParts({ core, canvas, audio, sram: store.sram, profileId });
    if (initial !== undefined) settings.push(initial);
    return true;
  };

  const stop = async (): Promise<void> => {
    parts?.loop?.stop();
    await parts?.sram?.stop();
    parts?.detachAudio();
    parts = null;
    audio.dispose();
    core.stop();
  };

  const setPaused = (paused: boolean): void => {
    core.setPaused(paused);
    if (paused) audio.suspend();
    else audio.resume();
  };

  const saves = () => {
    const current = parts;
    if (!current || !profileId) return null;
    return createSaveSlots({
      core, store, profileId, rom: romFile, capture: current.presenter.capture, onLoaded: () => settings.reassert(),
    });
  };

  return { core, audio, settings, saves, start, stop, setPaused };
};

export { createPortSession };
