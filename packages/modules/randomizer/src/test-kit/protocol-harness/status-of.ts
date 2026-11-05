/* @layer core @kind logic */
import type { ConnectionState } from '../../archipelago';
import { STATUS_OF } from './harness-status.constants';
import type { HarnessStatus } from './harness-session.type';

const statusOf = (state: ConnectionState): HarnessStatus => STATUS_OF[state];

export { statusOf };
