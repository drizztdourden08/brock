/* @layer stories @kind story */
import { useEffect, useMemo } from 'react';
import type { StoryLiteMeta, StoryLiteStoryDefinition, StoryLiteArgTypes } from '@storylite/storylite';
import { Box, Button, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { IconName } from '@drizztdourden08/tessera/primitives';
import { PlatformProvider, ScreenHost, ScreenRegistryContext, createScreenRegistry, defineHub, defineScreen, useNavigation, useProfilesStore } from '../src';
import type { HubDef, HubPage, HubRenderContext } from '../src';

type HubStoryArgs = {
  withSearch: boolean;
  secondHub: boolean;
};

const ARGS: Partial<HubStoryArgs> = { withSearch: true, secondHub: true };

const ARG_TYPES: StoryLiteArgTypes<HubStoryArgs> = {
  withSearch: { control: 'boolean' },
  secondHub: { control: 'boolean' },
};

const STORY_PROFILE = { id: 'story', name: 'Story', created: 0, lastPlayed: 0 };

const body = (text: string) => (ctx: HubRenderContext) => (
  <Stack>
    <Text>{text}</Text>
    <Text className="story-label">{ctx.hub.id} / {ctx.page.id}{ctx.tab ? ` / ${ctx.tab.id}` : ''}</Text>
  </Stack>
);

const page = (id: string, label: string, icon: IconName, tabs?: string[]): HubPage => ({
  id,
  label,
  icon: <Icon name={icon} />,
  tabs: tabs?.map((tab) => ({ id: tab.toLowerCase(), label: tab, render: body(`${label}: ${tab}`) })),
  render: body(label),
});

const multiworldHub = (withSearch: boolean): HubDef => ({
  id: 'multiworld',
  title: 'Multiworld',
  icon: <Icon name="globe" />,
  home: page('overview', 'Overview', 'house'),
  groups: [
    { id: 'play', label: 'Play', pages: [page('rooms', 'Rooms', 'users', ['Open', 'Archived']), page('players', 'Players', 'gamepad-2')] },
    { id: 'host', label: 'Host', pages: [page('servers', 'Servers', 'server'), page('logs', 'Logs', 'file-text', ['Live', 'History'])] },
  ],
  search: withSearch ? { placeholder: 'Search the multiworld' } : undefined,
});

const dataHub: HubDef = {
  id: 'data',
  title: 'Data',
  icon: <Icon name="hard-drive" />,
  home: page('summary', 'Summary', 'layout-grid'),
  groups: [{ id: 'sets', label: 'Sets', pages: [page('worlds', 'Worlds', 'layers'), page('items', 'Items', 'folder')] }],
};

const Home = () => {
  const { open } = useNavigation();
  return (
    <Stack>
      <Text>Base screen. Open a hub, then press Escape to come back.</Text>
      <Button variant="primary" onClick={() => open('multiworld')}>Open Multiworld</Button>
      <Button variant="secondary" onClick={() => open('multiworld', { section: 'rooms', tab: 'archived' })}>Open Rooms, Archived</Button>
    </Stack>
  );
};

const homeScreen = defineScreen({ id: 'home', title: 'Home', requiresProfile: false, render: () => <Home /> });

const Demo = (props: HubStoryArgs) => {
  const { withSearch, secondHub } = props;
  const registry = useMemo(() => {
    const hubs = secondHub ? [defineHub(multiworldHub(withSearch)), defineHub(dataHub)] : [defineHub(multiworldHub(withSearch))];
    return createScreenRegistry([homeScreen, ...hubs]);
  }, [withSearch, secondHub]);
  useEffect(() => { useProfilesStore.setState({ active: STORY_PROFILE }); }, []);
  return (
    <PlatformProvider>
      <ScreenRegistryContext.Provider value={registry}>
        <Box className="story-frame story-frame--tall">
          <ScreenHost home="home" />
        </Box>
      </ScreenRegistryContext.Provider>
    </PlatformProvider>
  );
};

const meta = {
  title: 'Hub/Hub',
  parameters: { renderer: 'react' },
} satisfies StoryLiteMeta<HubStoryArgs>;

const Playground = {
  name: 'Playground',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} />,
} satisfies StoryLiteStoryDefinition<HubStoryArgs>;

export default meta;
export { Playground };
