/* @layer renderer-shell @kind logic */
import { detectAxisFired } from './detect-axis-fired';
import { adoptIdleBaseline } from './adopt-idle-baseline';
import { detectFiredIndex } from './detect-fired-index';
import type { SampleParams } from './positional-capture.type';
import { settleRest } from './settle-rest';

const evaluatePositionalSample = (params: Omit<SampleParams, 'onItemsChange'>): void => {
  const { refs, sample, onAnswer } = params;
  if (!refs.inputPhaseActiveRef.current) return;
  const target = refs.targetsRef.current[refs.activeIndexRef.current];
  if (!target) return;
  const baseline = refs.baselineRef.current ?? adoptIdleBaseline(refs, sample);

  if (refs.awaitingRestRef.current) {
    settleRest(refs, baseline, sample);
    return;
  }

  const firedIndex = target.kind === 'button' ? detectFiredIndex(target, baseline, sample) : detectAxisFired(refs, baseline, sample);
  if (firedIndex !== null) onAnswer('captured', firedIndex);
};

export { evaluatePositionalSample };
