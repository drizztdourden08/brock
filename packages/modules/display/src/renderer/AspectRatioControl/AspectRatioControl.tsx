/* @layer renderer-shell @kind component */
import { useCallback, useMemo } from 'react';
import { useSafeAreaInsets } from '@drizztdourden08/brock-react';
import { Box, SegmentedControl, Small, Span, Text } from '@drizztdourden08/tessera/primitives';
import { screenReadout, viewportReadout } from '../../aspect-ratio/index';
import { PRESET_GROUP_IDS } from './AspectRatioControl.constants';
import type { AspectRatioControlProps } from './AspectRatioControl.type';
import { mainValueOf } from './behavior/main-value-of';
import { ratioChangeFor } from './behavior/ratio-change-for';
import { useRatioPair } from './behavior/useRatioPair';
import { RatioDetected } from './sub-components/RatioDetected';
import { RatioPairFields } from './sub-components/RatioPairFields';
import './AspectRatioControl.css';

const AspectRatioControl = (props: AspectRatioControlProps) => {
  const {
    label, description, value, options, presetOptions, widePresets, tallPresets, descriptions,
    recommendedValue, recommendedNote, customW, customH, limits, letterbox = false, onChange,
  } = props;

  useSafeAreaInsets();
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

  const text = descriptions?.[mainValue] ?? description;
  const viewport = mainValue === 'auto' ? viewportReadout(limits, letterbox) : null;
  const screen = mainValue === 'screen' ? screenReadout(limits) : null;
  const readout = viewport ?? screen;

  return (
    <Box className="aspect-ratio-control">
      <Box className="aspect-ratio-control__header">
        <Span className="aspect-ratio-control__label">{label}</Span>
        {text !== undefined && <Small tone="dim">{text}</Small>}
      </Box>
      <Box className="aspect-ratio-control__body">
        <SegmentedControl aria-label={label} value={mainValue} options={options} onChange={handleMain} />
        {Boolean(recommendedValue) && mainValue === recommendedValue && recommendedNote && (
          <Text className="aspect-ratio-control__recommended">{recommendedNote}</Text>
        )}
        {PRESET_GROUP_IDS.map((id) => {
          const groupOptions = groups[id];
          return mainValue === id && groupOptions && (
            <Box key={id} className="aspect-ratio-control__custom">
              <SegmentedControl value={value} options={groupOptions} onChange={handlePreset} />
            </Box>
          );
        })}
        {readout && <RatioDetected detected={readout.detected} used={readout.used} capped={readout.capped} />}
        {value === 'custom' && (
          <RatioPairFields w={pair.w} h={pair.h} check={pair.check} onWidth={pair.handleWidth} onHeight={pair.handleHeight} />
        )}
      </Box>
    </Box>
  );
};

export { AspectRatioControl };
