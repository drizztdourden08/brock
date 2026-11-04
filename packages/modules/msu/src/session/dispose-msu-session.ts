/* @layer core @kind logic */
import { stopMsuSession } from '../msu-session';
import { msuPackSessionOwner } from '../msu-pack-loader';
import { resetOriginalSound } from '../original-sound';

const disposeMsuSession = (): void => {
  stopMsuSession();
  resetOriginalSound();
  msuPackSessionOwner.profileId = null;
};

export { disposeMsuSession };
