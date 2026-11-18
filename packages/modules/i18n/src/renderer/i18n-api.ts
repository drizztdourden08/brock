/* @layer renderer-shell @kind logic */
import { hostApi } from '@drizztdourden08/brock-react';
import type { I18nApi } from '../i18n.type';
import { createWebI18nApi } from './web/create-web-i18n-api';

let web: I18nApi | null = null;

const i18nApi = (): I18nApi => {
  const host = hostApi()?.i18n;
  if (host) return host;
  web ??= createWebI18nApi();
  return web;
};

export { i18nApi };
