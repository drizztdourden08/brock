/* @layer core @kind logic */
import type { FormatKind } from '../parse/node.type';
import type { MessageValue } from '../message-values.type';
import { FORMATTERS } from './format-argument.constants';

const formatArgument = (kind: FormatKind, value: MessageValue, locale: string, style: string | undefined): string =>
  FORMATTERS[kind](value, locale, style);

export { formatArgument };
