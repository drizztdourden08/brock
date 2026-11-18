/* @layer core @kind logic */
import { PSEUDO_LOCALES } from './pseudo.constants';

const isPseudoLocale = (tag: string): boolean => PSEUDO_LOCALES.includes(tag);

export { isPseudoLocale };
