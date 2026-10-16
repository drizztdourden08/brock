/* @layer renderer-shell @kind logic */
import { formatDate } from '@drizztdourden08/tessera/primitives';
import { LOG_TIME_FORMAT } from './diagnostics.constants';

const formatLogTime = (timestamp: number): string => formatDate(timestamp, LOG_TIME_FORMAT);

export { formatLogTime };
