/* @layer renderer-shell @kind logic */
import { formatDate } from '@drizztdourden08/tessera/primitives';
import { LOG_TIME_FORMAT } from './diagnostics.constants';

const currentLocale = (): string | undefined => (typeof document === 'undefined' ? undefined : document.documentElement.lang || undefined);

const formatLogTime = (timestamp: number, locale?: string): string => formatDate(timestamp, LOG_TIME_FORMAT, { locale: locale ?? currentLocale() });

export { formatLogTime };
