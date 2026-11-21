/* @layer renderer-shell @kind component */
import { Status, Box, Field, Flex, NumberInput, Toggle } from '@drizztdourden08/tessera/primitives';
import { useT, useText } from '@drizztdourden08/brock-react';
import { WAIT_HINTS, WAIT_LABEL } from '../PlayModeFields.constants';
import type { RandomFieldsProps } from './RandomFields.type';

const RandomFields = (props: RandomFieldsProps) => {
  const { mode, layerId, disabled, onChange } = props;
  const t = useT();
  const text = useText();
  return (
    <>
      <Flex gap="md" align="end" wrap>
        <Field label={t('msu:play.shortest')}>
          <NumberInput
            min={0} step={0.25} max={3600} sizeToContent value={mode.minDelaySeconds} disabled={disabled}
            onChange={(value) => onChange({ ...mode, minDelaySeconds: Number.isFinite(value) ? value : 0 })}
          />
        </Field>
        <Field label={t('msu:play.longest')}>
          <NumberInput
            min={0} step={0.25} max={3600} sizeToContent value={mode.maxDelaySeconds} disabled={disabled}
            onChange={(value) => onChange({ ...mode, maxDelaySeconds: Number.isFinite(value) ? value : 0 })}
          />
        </Field>
        {mode.minDelaySeconds > mode.maxDelaySeconds && (
          <Status tone="danger">{t('msu:play.gapInvalid')}</Status>
        )}
      </Flex>
      <Box className="msu-accent-panel layer-card__switch">
        <Toggle
          id={`wait-for-completion-${layerId}`}
          label={text(WAIT_LABEL)}
          description={text(mode.waitForCompletion === true ? WAIT_HINTS.on : WAIT_HINTS.off)}
          checked={mode.waitForCompletion === true}
          disabled={disabled}
          onChange={(waitForCompletion) => onChange({ ...mode, waitForCompletion })}
        />
      </Box>
    </>
  );
};

export { RandomFields };
