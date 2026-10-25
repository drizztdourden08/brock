/* @layer renderer-shell @kind logic */
import { ALL_STEPS } from '../diagnostics-wizard.constants';
import type { WizardStepInfo } from '../diagnostics-wizard.type';

const visibleSteps = (hasByteCapability: boolean, hasChooser: boolean): readonly WizardStepInfo[] =>
  ALL_STEPS.filter((s) => (hasByteCapability || s.step !== 'byte-capture') && (hasChooser || s.step !== 'choose-controller'));

export { visibleSteps };
