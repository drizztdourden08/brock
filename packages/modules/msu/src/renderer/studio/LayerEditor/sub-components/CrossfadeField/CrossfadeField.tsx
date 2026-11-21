/* @layer renderer-shell @kind component */
import { Status, Box, Field, Flex, NumberInput, Slider } from '@drizztdourden08/tessera/primitives';
import { useT, useText } from '@drizztdourden08/brock-react';
import { useMsuStudioGame } from '../../../../game/useMsuStudioGame';
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import { CROSSFADE_HINT, CROSSFADE_LABEL } from '../../../PlayModeFields/PlayModeFields.constants';
import type { CrossfadeFieldProps } from './CrossfadeField.type';

const clamp = (value: number, max: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.round(Math.max(0, Math.min(max, value)) * 100) / 100;
};

const stateOf = (seconds: number, t: I18n['t']): string =>
  (seconds === 0 ? t('msu:play.crossfadeOff') : t('msu:play.crossfadeOverlap', { seconds: seconds.toFixed(2) }));

const CrossfadeField = (props: CrossfadeFieldProps) => {
  const { seconds, layerId, disabled = false, onChange } = props;
  const t = useT();
  const text = useText();
  const max = useMsuStudioGame<never, never>().maxCrossfadeSeconds;
  const inputId = `crossfade-${layerId}`;

  return (
    <Box className="msu-accent-panel layer-card__crossfade">
      <Field label={text(CROSSFADE_LABEL)} hint={text(CROSSFADE_HINT)} htmlFor={inputId}>
        <Flex gap="md" align="center" wrap>
          <Slider
            className="layer-card__crossfade-slider"
            value={seconds}
            min={0}
            max={max}
            step={0.25}
            disabled={disabled}
            showValue={false}
            onChange={(value) => onChange(clamp(value, max))}
          />
          <NumberInput
            id={inputId}
            min={0}
            max={max}
            step={0.25}
            sizeToContent
            value={seconds}
            disabled={disabled}
            aria-label={t('msu:play.crossfadeSeconds', { label: text(CROSSFADE_LABEL) })}
            onChange={(value) => onChange(clamp(value, max))}
          />
          <Status tone={seconds > 0 ? 'success' : 'neutral'}>{stateOf(seconds, t)}</Status>
        </Flex>
      </Field>
    </Box>
  );
};

export { CrossfadeField };
