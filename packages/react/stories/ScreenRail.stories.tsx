/* @layer stories @kind story */
import type { StoryLiteMeta, StoryLiteStoryDefinition, StoryLiteArgTypes } from '@storylite/storylite';
import { Box, Icon, Text } from '@drizztdourden08/tessera/primitives';
import { defineScreen, PlatformProvider, ScreenRail, useNavigation } from '../src';
import type { ScreenDef, ScreenRailGroup } from '../src';

type RailArgs = {
  collapsed: boolean;
  withLabels: boolean;
};

const house = <Icon name="house" />;
const gear = <Icon name="settings" />;
const book = <Icon name="bookmark" />;

const nothing = () => null;

const SCREENS: ScreenDef[] = [
  defineScreen({ id: 'home', title: 'Home', icon: house, requiresProfile: false, render: nothing }),
  defineScreen({ id: 'library', title: 'Library', icon: book, group: 'library', requiresProfile: false, render: nothing }),
  defineScreen({ id: 'favorites', title: 'Favorites', icon: book, group: 'library', requiresProfile: false, render: nothing }),
  defineScreen({ id: 'settings', title: 'Settings', icon: gear, group: 'app', requiresProfile: false, render: nothing }),
  defineScreen({ id: 'profiles', title: 'Profiles', icon: gear, group: 'app', render: nothing }),
];

const GROUPS: ScreenRailGroup[] = [
  { id: 'library', label: 'Library' },
  { id: 'app', label: 'Application' },
];

const ARGS: Partial<RailArgs> = { collapsed: false, withLabels: true };

const ARG_TYPES: StoryLiteArgTypes<RailArgs> = {
  collapsed: { control: 'boolean' },
  withLabels: { control: 'boolean' },
};

const ActiveReadout = () => {
  const { active } = useNavigation();
  return <Text variant="caption">Open screen: {active ?? 'none (home)'}</Text>;
};

const Demo = (props: RailArgs) => {
  const { collapsed, withLabels } = props;
  return (
    <PlatformProvider>
      <Box className="story-frame story-frame--tall">
        <ScreenRail screens={SCREENS} home="home" groups={withLabels ? GROUPS : undefined} collapsed={collapsed} />
        <ActiveReadout />
      </Box>
    </PlatformProvider>
  );
};

const meta = {
  title: 'Shell/ScreenRail',
  parameters: { renderer: 'react' },
} satisfies StoryLiteMeta<RailArgs>;

const Playground = {
  name: 'Playground',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} />,
} satisfies StoryLiteStoryDefinition<RailArgs>;

const Collapsed = {
  name: 'Collapsed',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} collapsed />,
} satisfies StoryLiteStoryDefinition<RailArgs>;

const RawGroupIds = {
  name: 'Group ids without labels',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} withLabels={false} />,
} satisfies StoryLiteStoryDefinition<RailArgs>;

export default meta;
export { Collapsed, Playground, RawGroupIds };
