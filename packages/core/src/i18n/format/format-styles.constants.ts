/* @layer core @kind constants */
const NUMBER_STYLES: Readonly<Record<string, Intl.NumberFormatOptions>> = {
  percent: { style: 'percent' },
  integer: { maximumFractionDigits: 0 },
  compact: { notation: 'compact' },
};

const DATE_STYLES: Readonly<Record<string, Intl.DateTimeFormatOptions>> = {
  short: { dateStyle: 'short' },
  medium: { dateStyle: 'medium' },
  long: { dateStyle: 'long' },
  full: { dateStyle: 'full' },
};

const TIME_STYLES: Readonly<Record<string, Intl.DateTimeFormatOptions>> = {
  short: { timeStyle: 'short' },
  medium: { timeStyle: 'medium' },
  long: { timeStyle: 'long' },
  full: { timeStyle: 'full' },
};

const LIST_STYLES: Readonly<Record<string, Intl.ListFormatOptions>> = {
  and: { type: 'conjunction' },
  or: { type: 'disjunction' },
};

export { NUMBER_STYLES, DATE_STYLES, TIME_STYLES, LIST_STYLES };
