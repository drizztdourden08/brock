/* @layer renderer-shell @kind logic */
import { hostApi } from '../../host/host-api';
import { currentStep } from './current-step';

const reportCeiling = (what: string, ceilingMs: number): void => {
  const reason = `gave up after ${Math.round(ceilingMs / 1000)} s waiting for ${what}`;
  hostApi()?.reviewCheck({ id: 'wait-ceiling', step: currentStep.name, pass: false, reason });
};

export { reportCeiling };
