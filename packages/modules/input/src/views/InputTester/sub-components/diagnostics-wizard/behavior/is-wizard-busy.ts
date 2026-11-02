/* @layer renderer-shell @kind logic */
import type { BusySource } from '../diagnostics-wizard.type';

const isWizardBusy = (wizard: BusySource): boolean => {
  const { layoutStage, step, restoreStatus } = wizard;
  const reading = layoutStage === 'starting' || layoutStage === 'fetching' || layoutStage === 'stopping';
  return reading || (step === 'positional-capture' && restoreStatus === 'pending');
};

export { isWizardBusy };
