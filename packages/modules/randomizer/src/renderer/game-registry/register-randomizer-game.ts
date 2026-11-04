/* @layer renderer-shell @kind logic */
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import { startSessionRuntime } from '../../session/boot/start-session-runtime';
import { useRandomizerGameStore } from './behavior/useRandomizerGameStore';
import type { RegisterOptions } from './register-options.type';

const noStop = (): void => undefined;

const registerRandomizerGame = <P, A>(game: RandomizerGame<P, A>, options: RegisterOptions = {}): (() => void) => {
  useRandomizerGameStore.getState().register(game);
  if (options.runtime === false) return noStop;
  return startSessionRuntime(game, options.log);
};

export { registerRandomizerGame };
