/* @layer electron-main @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import type { SplashTexts } from '../../splash-preload/splash-bridge.type';

const splashTexts = ({ t }: I18n): SplashTexts => ({
  starting: t('brock-main:splash.starting'),
  loading: t('brock-main:splash.loading'),
  retry: t('brock-main:splash.retry'),
  openLogs: t('brock-main:splash.openLogs'),
  quit: t('brock-main:splash.quit'),
  timedOut: t('brock-main:splash.timedOut', { label: '{label}' }),
  failed: t('brock-main:splash.failed', { label: '{label}' }),
});

export { splashTexts };
