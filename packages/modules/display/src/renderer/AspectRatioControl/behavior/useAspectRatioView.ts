/* @layer renderer-shell @kind hook */
import { useCallback, useMemo } from 'react';
import { screenReadout, viewportReadout } from '../../../aspect-ratio/index';
import type { AspectRatioControlProps } from '../AspectRatioControl.type';
import { mainValueOf } from './main-value-of';
import { ratioChangeFor } from './ratio-change-for';
import { useRatioPair } from './useRatioPair';

const useAspectRatioView = (props: AspectRatioControlProps) => {
  const {
    description, value, presetOptions, widePresets, tallPresets, descriptions,
    recommendedValue, recommendedNote, customW, customH, limits, letterbox = false, disabled = false, lockedMessage, onChange,
  } = props;

  const pair = useRatioPair({ customW, customH, limits, letterbox, onChange });
  const groups = useMemo(
    () => ({ wide: widePresets, tall: tallPresets, preset: presetOptions }),
    [widePresets, tallPresets, presetOptions],
  );
  const mainValue = mainValueOf(value, groups);

  const handleMain = useCallback((next: string) => {
    onChange(ratioChangeFor(next, { value, groups, customW, customH, limits, letterbox }));
  }, [value, groups, customW, customH, limits, letterbox, onChange]);

  const handlePreset = useCallback((next: string) => onChange({ value: next }), [onChange]);

  const viewport = mainValue === 'auto' ? viewportReadout(limits, letterbox) : null;
  const screen = mainValue === 'screen' ? screenReadout(limits) : null;

  return {
    pair,
    groups,
    mainValue,
    handleMain,
    handlePreset,
    text: descriptions?.[mainValue] ?? description,
    readout: viewport ?? screen,
    disabled,
    lockedNote: disabled ? lockedMessage : undefined,
    showRecommended: Boolean(recommendedValue) && mainValue === recommendedValue && Boolean(recommendedNote),
  };
};

export { useAspectRatioView };
