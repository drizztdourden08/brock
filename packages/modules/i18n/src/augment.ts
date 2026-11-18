/* @layer core @kind types */
import type { I18nApi, I18nState } from './i18n.type';

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract {
    'i18n:get': () => Promise<I18nState>;
    'i18n:set': (preference: string | null) => Promise<I18nState>;
  }

  interface EventContract {
    'i18n:changed': (state: I18nState) => void;
  }

  interface IpcNamespaces {
    i18n: I18nApi;
  }
}
