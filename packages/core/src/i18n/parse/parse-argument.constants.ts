/* @layer core @kind constants */
import type { ArgumentParser } from './parse.type';
import { parseDate } from './parse-date';
import { parseList } from './parse-list';
import { parseNumber } from './parse-number';
import { parsePlural } from './parse-plural';
import { parseSelect } from './parse-select';
import { parseSelectOrdinal } from './parse-selectordinal';
import { parseTime } from './parse-time';

const PARSERS: Readonly<Record<string, ArgumentParser>> = {
  number: parseNumber,
  date: parseDate,
  time: parseTime,
  list: parseList,
  plural: parsePlural,
  selectordinal: parseSelectOrdinal,
  select: parseSelect,
};

export { PARSERS };
