/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import type { LocaleSource } from '../modules/renderer-module.type';
import { getAppLog } from '../log/get-app-log';
import { I18N_LOG_CHANNEL } from './brock-layers.constants';

const warn = (error: unknown): void => getAppLog().log(I18N_LOG_CHANNEL, `locale source failed: ${String(error)}`, 'warn');

const useLocaleSource = (i18n: I18n, source: LocaleSource | undefined): boolean => {
  const [ready, setReady] = useState(source === undefined);

  useEffect(() => {
    if (!source) return undefined;
    let live = true;
    source.initial().then((tag) => i18n.setLocale(tag)).catch(warn).finally(() => live && setReady(true));
    return () => {
      live = false;
    };
  }, [i18n, source]);

  useEffect(() => source?.subscribe((tag) => void i18n.setLocale(tag).catch(warn)), [i18n, source]);

  return ready;
};

export { useLocaleSource };
