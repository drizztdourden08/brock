/* @layer core @kind logic */
const languageOf = (tag: string): string => (tag.split('-')[0] ?? '').toLowerCase();

export { languageOf };
