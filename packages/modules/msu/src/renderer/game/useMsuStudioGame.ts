/* @layer renderer-shell @kind hook */
import { useContext } from 'react';
import { MsuStudioContext } from './msu-studio-context';
import type { MsuStudioGame } from './msu-studio-game.type';

const useMsuStudioGame = <Ctx = unknown, Target = unknown>(): MsuStudioGame<Ctx, Target> => {
  const game = useContext(MsuStudioContext);
  if (game === null) throw new Error('useMsuStudioGame needs a MsuStudioProvider above it');
  return game as MsuStudioGame<Ctx, Target>;
};

export { useMsuStudioGame };
