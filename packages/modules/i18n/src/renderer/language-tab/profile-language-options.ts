/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { SettingChoiceDef } from '@drizztdourden08/brock-react';
import type { I18nState } from '../../i18n.type';
import { APP_VALUE } from '../i18n-renderer.constants';
import { languageName } from './language-name';
import { tagOptions } from './tag-options';

const profileLanguageOptions = (state: I18nState, current: string): SettingChoiceDef[] => [
  {
    value: APP_VALUE,
    label: msg('i18n:option.app.label'),
    hint: msg('i18n:option.app.hint', { language: languageName(state.locale, current) }),
  },
  ...tagOptions(state, current),
];

export { profileLanguageOptions };
