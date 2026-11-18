/* @layer core @kind logic */
const languageOf = (tag: string): string => (tag.split('-')[0] ?? '').toLowerCase();

const sameLanguage = (a: string, b: string): boolean => languageOf(a) === languageOf(b);

export { languageOf, sameLanguage };
