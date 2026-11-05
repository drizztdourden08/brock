/* @layer renderer-shell @kind logic */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';
import type { SessionStatus } from '../../../session';
import { SESSION_TONE } from './session-tone.constants';

const sessionToneOf = (status: SessionStatus): StatusTone => SESSION_TONE[status];

export { sessionToneOf };
