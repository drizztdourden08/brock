/* @layer renderer-shell @kind logic */
import type { ProfileWizardValues } from '@drizztdourden08/brock-react';
import { useRandomizerGameStore } from '../../game-registry/behavior/useRandomizerGameStore';
import { formOf } from '../../wizard/form-of';
import { ONLINE_MODE } from '../online-mode.constants';
import { connectionOfValues } from './connection-of-values';
import { connectionValuesOf } from './connection-values-of';
import { gameConnectionView } from './game-connection-view';

const connectionSummary = (values: ProfileWizardValues): string | undefined => {
  const { mode } = formOf(values);
  const view = gameConnectionView(useRandomizerGameStore.getState().game, mode);
  if (view?.summary) return view.summary(connectionValuesOf(values), values);
  return mode === ONLINE_MODE ? connectionOfValues(values).slotName || undefined : undefined;
};

export { connectionSummary };
