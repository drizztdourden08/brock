/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Stack, Toggle } from '@drizztdourden08/tessera/primitives';
import type { AssumptionTogglesProps } from './AssumptionToggles.type';

const AssumptionToggles = ({ assumptions, active, onChange }: AssumptionTogglesProps) => {
  const text = useText();
  return (
    <Stack gap="xs">
      {assumptions.map((assumption) => (
        <Toggle
          key={assumption.id}
          label={text(assumption.label)}
          description={assumption.hint === undefined ? undefined : text(assumption.hint)}
          checked={active.includes(assumption.id)}
          onChange={(checked) => onChange(checked ? [...active, assumption.id] : active.filter((id) => id !== assumption.id))}
        />
      ))}
    </Stack>
  );
};

export { AssumptionToggles };
