/* @layer core @kind logic */
import type { FormatBytesOptions } from './format-bytes.type';
import { formatBytesLocalized } from './format-bytes-localized';

const formatBytes = (bytes: number | null | undefined, options: FormatBytesOptions = {}): string => {
  const { nullText = '0 B', kbDecimals = 1, locale } = options;
  if (bytes == null) return nullText;
  if (locale) return formatBytesLocalized(bytes, locale, kbDecimals);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(kbDecimals)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export { formatBytes };
