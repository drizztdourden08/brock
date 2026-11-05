/* @layer renderer-shell @kind logic */
import type { ProfileWizardValues } from '@drizztdourden08/brock-react';
import { useRandomizerGameStore } from '../../game-registry/behavior/useRandomizerGameStore';
import { formOf } from '../../wizard/form-of';
import { ONLINE_MODE } from '../online-mode.constants';
import { gameConnectionView } from './game-connection-view';

const connectionShown = (values: ProfileWizardValues): boolean => {
  const game = useRandomizerGameStore.getState().game;
  const form = formOf(values);
  if (!form.enabled) return false;
  if (form.mode === ONLINE_MODE) return game?.archipelago !== undefined;
  return gameConnectionView(game, form.mode) !== null;
};

export { connectionShown };
