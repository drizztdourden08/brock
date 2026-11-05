/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { MsuStore } from '../../store/msu-store.type';
import type { MsuStudioGame } from '../msu-studio-game.type';

interface MsuStudioProviderProps<Ctx = unknown, Target = unknown> {
  game: MsuStudioGame<Ctx, Target>;
  store?: MsuStore | null;
  children: ReactNode;
}

export type { MsuStudioProviderProps };
