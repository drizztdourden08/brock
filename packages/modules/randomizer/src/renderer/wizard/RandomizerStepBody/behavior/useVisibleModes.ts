/* @layer renderer-shell @kind logic */
import { useEffect } from 'react';
import { currentShowContext, useProfilesStore } from '@drizztdourden08/brock-react';
import type { RandomizerModeId } from '../../../../augment';
import { useRandomizerGame } from '../../../game-registry/behavior/useRandomizerGame';
import { modeOptions } from '../../mode-options';
import type { ModeOption } from '../../mode-options.type';

const useVisibleModes = (
  mode: RandomizerModeId,
  onChange: (patch: { mode: RandomizerModeId }) => void,
): ModeOption[] => {
  useProfilesStore((state) => state.active);
  const options = modeOptions(useRandomizerGame(), currentShowContext());
  const visible = options.some((option) => option.value === mode);
  useEffect(() => {
    if (!visible) onChange({ mode: 'local' });
  }, [visible, onChange]);
  return options;
};

export { useVisibleModes };
