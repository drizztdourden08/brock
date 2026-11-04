/* @layer renderer-shell @kind component */
import { Stack, Toggle } from '@drizztdourden08/tessera/primitives';
import type { AssumptionTogglesProps } from './AssumptionToggles.type';

const AssumptionToggles = ({ assumptions, active, onChange }: AssumptionTogglesProps) => (
  <Stack gap="xs">
    {assumptions.map((assumption) => (
      <Toggle
        key={assumption.id}
        label={assumption.label}
        description={assumption.hint}
        checked={active.includes(assumption.id)}
        onChange={(checked) => onChange(checked ? [...active, assumption.id] : active.filter((id) => id !== assumption.id))}
      />
    ))}
  </Stack>
);

export { AssumptionToggles };
