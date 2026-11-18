/* @layer core @kind logic */
import { negotiateLocale } from '@drizztdourden08/brock-core/i18n';
import type { I18nState } from '../i18n.type';
import type { StateInput } from './preference.type';

const buildState = ({ preference, systemTags, offered, base }: StateInput): I18nState => {
  const system = negotiateLocale(systemTags, offered, base);
  const locale = preference === null ? system : negotiateLocale([preference], offered, system);
  return { locale, preference, system, offered };
};

export { buildState };
