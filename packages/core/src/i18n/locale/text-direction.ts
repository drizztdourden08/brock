/* @layer core @kind logic */
import type { Direction } from './locale.type';
import type { LocaleWithInfo } from './text-direction.type';
import { RTL_LANGUAGES } from './text-direction.constants';
import { languageOf } from './language-of';

const intlDirection = (tag: string): Direction | undefined => {
  try {
    const locale = new Intl.Locale(tag) as LocaleWithInfo;
    return (locale.getTextInfo?.() ?? locale.textInfo)?.direction;
  } catch {
    return undefined;
  }
};

const textDirection = (tag: string): Direction => {
  const known = intlDirection(tag);
  if (known) return known;
  return RTL_LANGUAGES.includes(languageOf(tag)) ? 'rtl' : 'ltr';
};

export { textDirection };
