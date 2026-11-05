/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { MsuStudioGame } from '../msu-studio-game.type';

interface MsuStudioProviderProps {
  game: MsuStudioGame<never, never>;
  children: ReactNode;
}

export type { MsuStudioProviderProps };
