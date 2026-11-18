/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { SettingChoiceDef } from '@drizztdourden08/brock-react';
import type { I18nState } from '../../i18n.type';
import { SYSTEM_VALUE } from '../i18n-renderer.constants';
import { languageName } from './language-name';
import { tagOptions } from './tag-options';

const appLanguageOptions = (state: I18nState, current: string): SettingChoiceDef[] => [
  {
    value: SYSTEM_VALUE,
    label: msg('i18n:option.system.label'),
    hint: msg('i18n:option.system.hint', { language: languageName(state.system, current) }),
  },
  ...tagOptions(state, current),
];

export { appLanguageOptions };
