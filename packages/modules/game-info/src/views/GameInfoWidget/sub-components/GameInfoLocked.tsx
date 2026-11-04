/* @layer renderer-shell @kind component */
import { EmptyState } from '@drizztdourden08/tessera/primitives';

interface GameInfoLockedProps {
  reason: string;
}

const GameInfoLocked = ({ reason }: GameInfoLockedProps) => <EmptyState size="sm" message={reason} />;

export { GameInfoLocked };
