/* @layer renderer-shell @kind component */
import { Box, Button, Field, Flex, Select } from '@drizztdourden08/tessera/primitives';
import { useT, useText } from '@drizztdourden08/brock-react';
import type { LayerEffect } from '../../../types';
import { EffectRow } from './sub-components/EffectRow';
import { presetOptions } from './effect-options';
import { DEFAULT_EFFECT, EFFECTS_HINT, EFFECTS_LABEL, PRESETS } from './LayerEffectsField.constants';
import type { LayerEffectsFieldProps } from './LayerEffectsField.type';

const sameChain = (a: LayerEffect[], b: LayerEffect[]): boolean => JSON.stringify(a) === JSON.stringify(b);

const presetOf = (effects: LayerEffect[]): string =>
  PRESETS.find((preset) => sameChain(preset.effects, effects))?.id ?? '';

const LayerEffectsField = (props: LayerEffectsFieldProps) => {
  const { effects, disabled = false, onChange } = props;
  const t = useT();
  const text = useText();

  const choosePreset = (id: string): void => {
    onChange(id === '' ? [] : (PRESETS.find((preset) => preset.id === id)?.effects ?? []));
  };
  const replaceAt = (index: number, effect: LayerEffect): void =>
    onChange(effects.map((current, i) => (i === index ? effect : current)));
  const removeAt = (index: number): void => onChange(effects.filter((_, i) => i !== index));

  return (
    <Box className="msu-accent-panel layer-card__effects">
      <Field label={text(EFFECTS_LABEL)} hint={text(EFFECTS_HINT)}>
        <Flex gap="sm" align="center" wrap>
          <Select value={presetOf(effects)} options={presetOptions(t, text)} disabled={disabled} onChange={choosePreset} />
          <Button variant="tertiary" size="sm" disabled={disabled} onClick={() => onChange([...effects, DEFAULT_EFFECT.lowpass])}>
            {t('msu:effects.add')}
          </Button>
        </Flex>
      </Field>

      {effects.map((effect, index) => (
        <EffectRow
          key={index}
          effect={effect}
          index={index}
          disabled={disabled}
          onChange={(next) => replaceAt(index, next)}
          onRemove={() => removeAt(index)}
        />
      ))}
    </Box>
  );
};

export { LayerEffectsField };
