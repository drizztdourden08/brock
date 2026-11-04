/* @layer core @kind logic */
import { originalSoundState } from './original-sound-state';
import { stopOriginalSound } from './stop-original-sound';

const resetOriginalSound = (): void => {
  stopOriginalSound();
  originalSoundState.cache.clear();
  const context = originalSoundState.context;
  originalSoundState.context = null;
  void context?.close();
};

export { resetOriginalSound };
