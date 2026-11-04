/* @layer renderer-shell @kind logic */
import type { RegisteredGame } from '../../game-registry/randomizer-game-state.type';

const bindGameSignals = (game: RegisteredGame, onChange: () => void): (() => void) => {
  const stopCore = game.core.subscribe(onChange);
  const stopPush = game.tracker?.subscribe?.(onChange);
  return () => {
    stopCore();
    stopPush?.();
  };
};

export { bindGameSignals };
