/* @layer renderer-shell @kind component */
import { Card, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';
import { OptionField } from './sub-components/OptionField';
import { sectionsOf } from './behavior/sections-of';
import { NO_OPTIONS_TEXT } from './OptionsStepBody.constants';
import type { OptionsStepBodyProps } from './OptionsStepBody.type';

const OptionsStepBody = (props: OptionsStepBodyProps) => {
  const { value, onChange } = props;
  const game = useRandomizerGame();
  const GameBody = game?.views?.optionsStep;
  if (GameBody) return <GameBody {...props} />;
  const catalog = game?.catalog ?? [];
  if (catalog.length === 0) return <Text variant="caption">{NO_OPTIONS_TEXT}</Text>;
  return (
    <Stack gap="md">
      {sectionsOf(catalog).map(([section, options]) => (
        <Card key={section} title={section === '' ? undefined : section}>
          <Stack gap="md">
            {options.map((option) => (
              <OptionField
                key={option.key}
                option={option}
                value={value.overrides[option.key] ?? option.default}
                onChange={(next) => onChange({ overrides: { ...value.overrides, [option.key]: next } })}
              />
            ))}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};

export { OptionsStepBody };
