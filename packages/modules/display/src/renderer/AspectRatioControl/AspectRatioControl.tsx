/* @layer renderer-shell @kind component */
import { useSafeAreaInsets } from '@drizztdourden08/brock-react';
import { Box, SegmentedControl, Small, Span, Text } from '@drizztdourden08/tessera/primitives';
import { PRESET_GROUP_IDS } from './AspectRatioControl.constants';
import type { AspectRatioControlProps } from './AspectRatioControl.type';
import { useAspectRatioView } from './behavior/useAspectRatioView';
import { RatioDetected } from './sub-components/RatioDetected';
import { RatioPairFields } from './sub-components/RatioPairFields';
import './AspectRatioControl.css';

const AspectRatioControl = (props: AspectRatioControlProps) => {
  const { label, value, options, recommendedNote } = props;
  useSafeAreaInsets();
  const { pair, groups, mainValue, handleMain, handlePreset, text, readout, showRecommended, disabled, lockedNote } = useAspectRatioView(props);

  return (
    <Box className="aspect-ratio-control">
      <Box className="aspect-ratio-control__header">
        <Span className="aspect-ratio-control__label">{label}</Span>
        {text !== undefined && <Small tone="dim">{text}</Small>}
      </Box>
      {lockedNote !== undefined && <Small tone="dim">{lockedNote}</Small>}
      <Box className="aspect-ratio-control__body">
        <SegmentedControl aria-label={label} value={mainValue} options={options} disabled={disabled} onChange={handleMain} />
        {showRecommended && <Text className="aspect-ratio-control__recommended">{recommendedNote}</Text>}
        {PRESET_GROUP_IDS.map((id) => {
          const groupOptions = groups[id];
          return mainValue === id && groupOptions && (
            <Box key={id} className="aspect-ratio-control__custom">
              <SegmentedControl value={value} options={groupOptions} disabled={disabled} onChange={handlePreset} />
            </Box>
          );
        })}
        {readout && <RatioDetected detected={readout.detected} used={readout.used} capped={readout.capped} />}
        {value === 'custom' && (
          <RatioPairFields w={pair.w} h={pair.h} check={pair.check} onWidth={pair.handleWidth} onHeight={pair.handleHeight} disabled={disabled} />
        )}
      </Box>
    </Box>
  );
};

export { AspectRatioControl };
