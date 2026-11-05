/* @layer renderer-shell @kind logic */
import type { ProfileWizardValues } from '@drizztdourden08/brock-react';
import { useRandomizerGameStore } from '../../game-registry/behavior/useRandomizerGameStore';
import { formOf } from '../../wizard/form-of';
import { ONLINE_MODE } from '../online-mode.constants';
import { connectionProblem } from './connection-problem';
import { connectionValuesOf } from './connection-values-of';
import { gameConnectionView } from './game-connection-view';

const connectionValidate = (values: ProfileWizardValues): string | null => {
  const { mode } = formOf(values);
  const view = gameConnectionView(useRandomizerGameStore.getState().game, mode);
  if (view?.validate) return view.validate(connectionValuesOf(values), values);
  return mode === ONLINE_MODE ? connectionProblem(values) : null;
};

export { connectionValidate };
