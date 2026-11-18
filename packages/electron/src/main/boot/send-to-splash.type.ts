/* @layer electron-main @kind types */
import type { SPLASH_CHANNELS } from '../../splash-preload/splash-channels.constants';

type SplashChannel = typeof SPLASH_CHANNELS.progress | typeof SPLASH_CHANNELS.failure | typeof SPLASH_CHANNELS.text;

export type { SplashChannel };
