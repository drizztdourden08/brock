/* @layer renderer-app @kind component */
import { SearchAnchor } from '@drizztdourden08/brock-react';
import type { PageProps, ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { Stack, StatRow, Text } from '@drizztdourden08/tessera/primitives';

const meta: ScreenMeta = { title: 'Controls', icon: 'keyboard', order: 2, keywords: ['bindings', 'keys', 'gamepad'] };

const searchEntries: SearchEntrySeed[] = [
  { label: 'Jump', keywords: ['space', 'button a'], anchor: 'jump', description: 'Space or button A' },
  { label: 'Interact', keywords: ['e', 'button x'], anchor: 'interact', description: 'E or button X' },
  { label: 'Pause', keywords: ['escape', 'start'], anchor: 'pause', description: 'Escape or Start' },
];

const ControlsPage = (props: PageProps) => {
  const { bucket } = props;
  return (
    <Stack>
      <Text variant="body">A custom page: it keeps the {bucket.title} hub frame, nav, header and search, and draws its own content.</Text>
      {searchEntries.map((entry) => (
        <SearchAnchor key={entry.label} anchor={entry.anchor ?? entry.label}>
          <StatRow label={entry.label} value={entry.description} />
        </SearchAnchor>
      ))}
    </Stack>
  );
};

export default ControlsPage;
export { meta, searchEntries };
