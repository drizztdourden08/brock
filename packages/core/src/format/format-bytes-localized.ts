/* @layer core @kind logic */
import { KB } from './format-bytes-localized.constants';
import { numberFormat } from '../i18n/intl-cache/number-format';

const unitFormat = (locale: string, unit: string, decimals: number): Intl.NumberFormat =>
  numberFormat(locale, { style: 'unit', unit, unitDisplay: 'short', minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const formatBytesLocalized = (bytes: number, locale: string, kbDecimals: number): string => {
  if (bytes < KB) return unitFormat(locale, 'byte', 0).format(bytes);
  if (bytes < KB * KB) return unitFormat(locale, 'kilobyte', kbDecimals).format(bytes / KB);
  if (bytes < KB * KB * KB) return unitFormat(locale, 'megabyte', 1).format(bytes / (KB * KB));
  return unitFormat(locale, 'gigabyte', 1).format(bytes / (KB * KB * KB));
};

export { formatBytesLocalized };
