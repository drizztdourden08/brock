/* @layer stories @kind story */
import { useState } from 'react';
import type { StoryLiteMeta, StoryLiteStoryDefinition, StoryLiteArgTypes } from '@storylite/storylite';
import { Box, Select, Text } from '@drizztdourden08/tessera/primitives';
import { CreateProfileForm } from '../src';

type FormArgs = {
  withExtraField: boolean;
  withCancel: boolean;
  error: string;
};

const REGIONS = [
  { value: 'eu', label: 'Europe' },
  { value: 'us', label: 'Americas' },
];

const ARGS: Partial<FormArgs> = { withExtraField: true, withCancel: true, error: '' };

const ARG_TYPES: StoryLiteArgTypes<FormArgs> = {
  withExtraField: { control: 'boolean' },
  withCancel: { control: 'boolean' },
  error: { control: 'text' },
};

const Demo = (props: FormArgs) => {
  const { withExtraField, withCancel, error } = props;
  const [region, setRegion] = useState('');
  const [created, setCreated] = useState<string | null>(null);
  return (
    <Box className="story-column">
      <CreateProfileForm
        onCreate={(name) => setCreated(`${name}${withExtraField ? ` (${region})` : ''}`)}
        onCancel={withCancel ? () => setCreated(null) : undefined}
        extraFields={withExtraField ? <Select value={region} onChange={setRegion} options={REGIONS} placeholder="Region" /> : undefined}
        canSubmit={!withExtraField || region !== ''}
        error={error || null}
      />
      <Text className="story-label">{created ? `Created: ${created}` : 'Nothing created yet'}</Text>
    </Box>
  );
};

const meta = {
  title: 'Shell/CreateProfileForm',
  parameters: { renderer: 'react' },
} satisfies StoryLiteMeta<FormArgs>;

const Playground = {
  name: 'Playground',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} />,
} satisfies StoryLiteStoryDefinition<FormArgs>;

const NameOnly = {
  name: 'Name only',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} withExtraField={false} withCancel={false} />,
} satisfies StoryLiteStoryDefinition<FormArgs>;

export default meta;
export { NameOnly, Playground };
