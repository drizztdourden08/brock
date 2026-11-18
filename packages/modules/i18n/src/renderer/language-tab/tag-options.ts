/* @layer renderer-shell @kind logic */
import type { SettingChoiceDef } from '@drizztdourden08/brock-react';
import type { I18nState } from '../../i18n.type';
import { languageName } from './language-name';

const tagOptions = (state: I18nState, current: string): SettingChoiceDef[] =>
  state.offered.map((tag) => {
    const own = languageName(tag, tag);
    const here = languageName(tag, current);
    return { value: tag, label: own, ...(here === own ? {} : { hint: here }) };
  });

export { tagOptions };
