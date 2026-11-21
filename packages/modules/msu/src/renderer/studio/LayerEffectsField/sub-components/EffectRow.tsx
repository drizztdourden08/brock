/* @layer renderer-shell @kind component */
import { Box, Flex, IconButton, NumberInput, Select, Text } from '@drizztdourden08/tessera/primitives';
import { useT } from '@drizztdourden08/brock-react';
import type { LayerEffect } from '../../../../types';
import { DEFAULT_EFFECT, MAX_DB, MAX_HZ, MIN_HZ } from '../LayerEffectsField.constants';
import { effectKindOptions } from '../behavior/effect-kind-options';
import type { EffectRowProps } from '../LayerEffectsField.type';

const hz = (value: number): number => Math.round(Math.min(MAX_HZ, Math.max(MIN_HZ, value)));
const db = (value: number): number => Math.round(Math.min(MAX_DB, Math.max(-MAX_DB, value)) * 10) / 10;

const EffectRow = (props: EffectRowProps) => {
  const { effect, index, disabled, onChange, onRemove } = props;
  const t = useT();
  const band = (label: string, value: number, set: (next: number) => LayerEffect) => (
    <Flex gap="xs" align="center">
      <Text className="layer-card__effect-label">{label}</Text>
      <NumberInput value={value} min={-MAX_DB} max={MAX_DB} step={0.5} sizeToContent disabled={disabled}
        onChange={(next) => onChange(set(db(next)))} />
      <Text className="layer-card__effect-unit">dB</Text>
    </Flex>
  );

  return (
    <Box className="layer-card__effect">
      <Flex gap="sm" align="center" wrap>
        <Text className="layer-card__effect-index">{index + 1}</Text>
        <Select
          value={effect.kind}
          options={effectKindOptions(t)}
          disabled={disabled}
          onChange={(kind) => onChange(DEFAULT_EFFECT[kind as LayerEffect['kind']])}
        />
        {effect.kind !== 'eq' ? (
          <Flex gap="xs" align="center">
            <Text className="layer-card__effect-label">{t('msu:effects.cutoff')}</Text>
            <NumberInput value={effect.frequencyHz} min={MIN_HZ} max={MAX_HZ} step={50} sizeToContent disabled={disabled}
              onChange={(next) => onChange({ ...effect, frequencyHz: hz(next) })} />
            <Text className="layer-card__effect-unit">Hz</Text>
          </Flex>
        ) : (
          <>
            {band(t('msu:effects.low'), effect.lowDb, (lowDb) => ({ ...effect, lowDb }))}
            {band(t('msu:effects.mid'), effect.midDb, (midDb) => ({ ...effect, midDb }))}
            {band(t('msu:effects.high'), effect.highDb, (highDb) => ({ ...effect, highDb }))}
          </>
        )}
        <IconButton variant="ghost" size="sm" label={t('msu:effects.remove', { index: index + 1 })} disabled={disabled} onClick={onRemove}>
          ✕
        </IconButton>
      </Flex>
    </Box>
  );
};

export { EffectRow };
