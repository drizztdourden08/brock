/* @layer renderer-shell @kind component */
import { EmptyState } from '@drizztdourden08/tessera/primitives';
import type { GameInfoLockedProps } from './GameInfoLocked.type';

const GameInfoLocked = ({ reason }: GameInfoLockedProps) => <EmptyState size="sm" message={reason} />;

export { GameInfoLocked };
