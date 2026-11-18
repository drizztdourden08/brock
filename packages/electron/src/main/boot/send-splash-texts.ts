/* @layer electron-main @kind logic */
import { SPLASH_CHANNELS } from '../../splash-preload/splash-channels.constants';
import { mainI18n } from '../i18n/main-i18n';
import { sendToSplash } from './send-to-splash';
import { splashTexts } from './splash-texts';

const sendSplashTexts = (): void => {
  sendToSplash(SPLASH_CHANNELS.text, splashTexts(mainI18n()));
};

export { sendSplashTexts };
