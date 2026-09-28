/* @layer stories @kind story */
import { useState } from 'react';
import type { StoryLiteMeta, StoryLiteStoryDefinition, StoryLiteArgTypes } from '@storylite/storylite';
import type { Profile } from '@drizztdourden08/brock-core';
import { Box, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { ProfileCard } from '../src';

type CardArgs = {
  withSubtitle: boolean;
  deletable: boolean;
};

const HOUR = 60 * 60 * 1000;

const PROFILES: Profile[] = [
  { id: 'a1b2c3d4', name: 'mira', created: Date.now() - 40 * HOUR, lastPlayed: Date.now() - 2 * HOUR },
  { id: 'e5f6a7b8', name: 'weekend run', created: Date.now() - 200 * HOUR, lastPlayed: Date.now() - 30 * HOUR },
];

const ARGS: Partial<CardArgs> = { withSubtitle: true, deletable: true };

const ARG_TYPES: StoryLiteArgTypes<CardArgs> = {
  withSubtitle: { control: 'boolean' },
  deletable: { control: 'boolean' },
};

const Demo = (props: CardArgs) => {
  const { withSubtitle, deletable } = props;
  const [selected, setSelected] = useState(PROFILES[0]?.id ?? '');
  return (
    <Box className="story-column">
      <Stack gap="sm">
        {PROFILES.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            subtitle={withSubtitle ? `Created ${new Date(profile.created).toLocaleDateString()}` : undefined}
            selected={selected === profile.id}
            onSelect={(p) => setSelected(p.id)}
            onDelete={deletable ? () => undefined : undefined}
          />
        ))}
      </Stack>
      <Text className="story-label">Selected: {selected}</Text>
    </Box>
  );
};

const meta = {
  title: 'Shell/ProfileCard',
  parameters: { renderer: 'react' },
} satisfies StoryLiteMeta<CardArgs>;

const Playground = {
  name: 'Playground',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} />,
} satisfies StoryLiteStoryDefinition<CardArgs>;

export default meta;
export { Playground };
