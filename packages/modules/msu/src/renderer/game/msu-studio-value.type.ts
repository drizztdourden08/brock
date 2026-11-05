/* @layer renderer-shell @kind types */
import type { MsuStore } from '../store/msu-store.type';
import type { MsuStudioGame } from './msu-studio-game.type';

interface MsuStudioValue<Ctx = unknown, Target = unknown> {
  game: MsuStudioGame<Ctx, Target>;
  store: MsuStore;
}

interface MsuStudioContextValue {
  game: MsuStudioGame;
  store: MsuStore | null;
}

export type { MsuStudioContextValue, MsuStudioValue };
