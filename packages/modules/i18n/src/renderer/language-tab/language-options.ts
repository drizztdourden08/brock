/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { SettingChoiceDef } from '@drizztdourden08/brock-react';
import type { I18nState } from '../../i18n.type';
import { APP_VALUE, SYSTEM_VALUE } from '../i18n-renderer.constants';
import { languageName } from './language-name';

const tagOption = (tag: string, current: string): SettingChoiceDef => {
  const own = languageName(tag, tag);
  const here = languageName(tag, current);
  return { value: tag, label: own, ...(here === own ? {} : { hint: here }) };
};

const tagOptions = (state: I18nState, current: string): SettingChoiceDef[] => state.offered.map((tag) => tagOption(tag, current));

const appLanguageOptions = (state: I18nState, current: string): SettingChoiceDef[] => [
  {
    value: SYSTEM_VALUE,
    label: msg('i18n:option.system.label'),
    hint: msg('i18n:option.system.hint', { language: languageName(state.system, current) }),
  },
  ...tagOptions(state, current),
];

const profileLanguageOptions = (state: I18nState, current: string): SettingChoiceDef[] => [
  {
    value: APP_VALUE,
    label: msg('i18n:option.app.label'),
    hint: msg('i18n:option.app.hint', { language: languageName(state.locale, current) }),
  },
  ...tagOptions(state, current),
];

export { appLanguageOptions, profileLanguageOptions };
