/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { LogRule } from '../../../../contract/randomizer-views.type';
import { useRandomizerGame } from '../../../game-registry/behavior/useRandomizerGame';
import { ACTIVITY_RULES } from '../activity-rules.constants';

const NO_RULES: readonly LogRule[] = [];

const useActivityRules = (): { rules: readonly LogRule[]; gameRules: readonly LogRule[] } => {
  const gameRules = useRandomizerGame()?.views?.logRules ?? NO_RULES;
  return useMemo(() => ({ rules: [...ACTIVITY_RULES, ...gameRules], gameRules }), [gameRules]);
};

export { useActivityRules };
