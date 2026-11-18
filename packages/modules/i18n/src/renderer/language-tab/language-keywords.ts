/* @layer renderer-shell @kind logic */
import type { I18nState } from '../../i18n.type';
import { LANGUAGE_KEYWORDS } from './language-tab.constants';
import { languageName } from './language-name';

const languageKeywords = (state: I18nState): string =>
  [...LANGUAGE_KEYWORDS, ...state.offered.flatMap((tag) => [tag, languageName(tag, tag)])].join(' ');

export { languageKeywords };
