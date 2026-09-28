/* @layer stories @kind story */
import { useState } from 'react';
import type { StoryLiteMeta, StoryLiteStoryDefinition, StoryLiteArgTypes } from '@storylite/storylite';
import { Box } from '@drizztdourden08/tessera/primitives';
import { PlatformProvider, SettingsHub } from '../src';
import { SAMPLE_DEFAULTS, SAMPLE_TABS } from './_samples/settings';
import type { SampleSettings } from './_samples/settings';

type HubArgs = {
  withDefaults: boolean;
  searchPlaceholder: string;
};

const ARGS: Partial<HubArgs> = { withDefaults: true, searchPlaceholder: 'Search all settings' };

const ARG_TYPES: StoryLiteArgTypes<HubArgs> = {
  withDefaults: { control: 'boolean' },
  searchPlaceholder: { control: 'text' },
};

const Demo = (props: HubArgs) => {
  const { withDefaults, searchPlaceholder } = props;
  const [settings, setSettings] = useState<SampleSettings>(SAMPLE_DEFAULTS);
  return (
    <PlatformProvider>
      <Box className="story-frame story-frame--tall">
        <SettingsHub
          tabs={SAMPLE_TABS}
          settings={settings}
          defaults={withDefaults ? SAMPLE_DEFAULTS : undefined}
          onChange={(patch) => setSettings((prev) => ({ ...prev, ...patch }))}
          searchPlaceholder={searchPlaceholder}
        />
      </Box>
    </PlatformProvider>
  );
};

const meta = {
  title: 'Settings/SettingsHub',
  parameters: { renderer: 'react' },
} satisfies StoryLiteMeta<HubArgs>;

const Playground = {
  name: 'Playground',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} />,
} satisfies StoryLiteStoryDefinition<HubArgs>;

export default meta;
export { Playground };
