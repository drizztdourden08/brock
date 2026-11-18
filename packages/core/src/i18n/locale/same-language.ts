/* @layer core @kind logic */
import { languageOf } from './language-of';

const sameLanguage = (a: string, b: string): boolean => languageOf(a) === languageOf(b);

export { sameLanguage };
