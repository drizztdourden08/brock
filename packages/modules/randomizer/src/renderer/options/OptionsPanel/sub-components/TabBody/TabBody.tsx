/* @layer renderer-shell @kind component */
import { Card, Stack } from '@drizztdourden08/tessera/primitives';
import { useRandomizerGame } from '../../../../game-registry/behavior/useRandomizerGame';
import { OptionField } from '../OptionField';
import type { TabBodyProps } from './TabBody.type';

const TabBody = ({ tab, ...props }: TabBodyProps) => {
  const game = useRandomizerGame();
  const { overrides, onChange, frozen } = props;
  if (tab.Body) return <tab.Body {...props} />;
  const options = (game?.catalog ?? []).filter((option) => tab.keys?.includes(option.key));
  return (
    <Card>
      <Stack gap="md">
        {options.map((option) => (
          <OptionField
            key={option.key}
            option={{ ...option, frozen: frozen || option.frozen === true }}
            value={overrides[option.key] ?? option.default}
            onChange={(next) => onChange?.({ ...overrides, [option.key]: next })}
          />
        ))}
      </Stack>
    </Card>
  );
};

export { TabBody };
