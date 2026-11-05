/* @layer renderer-shell @kind types */
import type { MsuStudioGame } from '../game/msu-studio-game.type';
import type { MsuStore } from '../store/msu-store.type';
import type { DeleteConfirm, MsuPackOrigin } from './msu-origin.type';

interface MsuStudioPageProps {
  game: MsuStudioGame<never, never>;
  store: MsuStore;
  onDeleteConfirm: DeleteConfirm;
  onRefresh: () => void;
  useOrigin?: MsuPackOrigin;
}

type MsuStudioBodyProps = Omit<MsuStudioPageProps, 'game' | 'store'>;

export type { MsuStudioBodyProps, MsuStudioPageProps };
