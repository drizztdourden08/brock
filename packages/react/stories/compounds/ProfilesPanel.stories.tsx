/* @layer stories @kind story */
import { useState } from 'react';
import type { StoryLiteArgTypes, StoryLiteMeta, StoryLiteStoryDefinition } from '@storylite/storylite';
import { ProfilesPanel } from '../../src/compounds/ProfilesPanel';
import type { ProfilesPanelItem } from '../../src/compounds/ProfilesPanel';

type ProfilesPanelArgs = {
  title: string;
  empty: boolean;
};

const START: ProfilesPanelItem[] = [
  { id: 'p1', name: 'Mira', aside: 'today' },
  { id: 'p2', name: 'Second run', meta: 'Hard mode', aside: 'last week' },
];

const ARG_TYPES: StoryLiteArgTypes<ProfilesPanelArgs> = {
  title: { control: 'text' },
  empty: { control: 'boolean' },
};

const Demo = (props: ProfilesPanelArgs) => {
  const { title, empty } = props;
  const [profiles, setProfiles] = useState<ProfilesPanelItem[]>(empty ? [] : START);
  const [selected, setSelected] = useState<string | null>(null);
  const create = (name: string): Promise<void> => {
    setProfiles((list) => [...list, { id: `p${String(list.length + 1)}`, name, aside: 'now' }]);
    return Promise.resolve();
  };
  const rename = (id: string, name: string): Promise<void> => {
    setProfiles((list) => list.map((profile) => (profile.id === id ? { ...profile, name } : profile)));
    return Promise.resolve();
  };
  return (
    <ProfilesPanel
      title={title}
      profiles={profiles}
      selectedId={selected}
      onSelect={setSelected}
      onCreate={create}
      onRename={rename}
      onDelete={(id) => setProfiles((list) => list.filter((profile) => profile.id !== id))}
      createOpen={profiles.length === 0}
    />
  );
};

const meta = {
  title: 'Compounds/ProfilesPanel',
  parameters: { renderer: 'react' },
} satisfies StoryLiteMeta<ProfilesPanelArgs>;

const Playground = {
  name: 'Playground',
  args: { title: 'Pick a profile, or create another', empty: false },
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} />,
} satisfies StoryLiteStoryDefinition<ProfilesPanelArgs>;

const Default = {
  name: 'Default',
  render: () => <Demo title="Create a profile to get started" empty />,
} satisfies StoryLiteStoryDefinition<ProfilesPanelArgs>;

export default meta;
export { Default, Playground };
