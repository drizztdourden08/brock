/* @layer renderer-shell @kind logic */
import { detectScreenRatio } from '../../../aspect-ratio/index';
import { PRESET_FALLBACK, PRESET_GROUP_IDS } from '../AspectRatioControl.constants';
import type { AspectRatioChange, PresetGroupId, RatioChangeParams } from '../AspectRatioControl.type';

const isPresetGroup = (next: string): next is PresetGroupId => PRESET_GROUP_IDS.some((id) => id === next);

const ratioChangeFor = (next: string, params: RatioChangeParams): AspectRatioChange => {
  const { value, groups, customW, customH, limits, letterbox } = params;
  if (isPresetGroup(next)) {
    const options = groups[next];
    const fallback = options?.[0]?.value ?? PRESET_FALLBACK[next];
    return { value: options?.some((option) => option.value === value) ? value : fallback };
  }
  if (next === 'custom' && !(customW > 0 && customH > 0)) {
    const d = detectScreenRatio(limits, letterbox);
    return { value: 'custom', customW: d.w, customH: d.h };
  }
  return { value: next };
};

export { ratioChangeFor };
