/* @layer renderer-shell @kind hook */
import { useBrock } from '../../app/useBrock';
import type { ProfileWizardStepDef } from './profile-wizard-step.type';

const useModuleWizardSteps = (): readonly ProfileWizardStepDef[] => useBrock().profileWizardSteps;

export { useModuleWizardSteps };
