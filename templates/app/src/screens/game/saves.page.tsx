/* @layer renderer-app @kind component */
import { usePageSearch } from '@drizztdourden08/brock-react';
import type { PageProps, ScreenMeta } from '@drizztdourden08/brock-react';
import { EmptyState, Stack, StatRow, Text } from '@drizztdourden08/tessera/primitives';

const meta: ScreenMeta = {
  title: 'Saves',
  icon: 'save',
  order: 1,
  keywords: ['slots', 'progress'],
  menu: 'Game',
  header: { primary: { label: 'New save', icon: 'plus', open: 'new' }, search: { placeholder: 'Filter saves' } },
};

const SavesPage = (props: PageProps) => {
  const { bucket } = props;
  const filter = usePageSearch().trim().toLowerCase();
  const saves = [{ name: 'Forest camp', when: 'Today' }, { name: 'Before the bridge', when: 'Yesterday' }];
  const shown = saves.filter((save) => save.name.toLowerCase().includes(filter));
  return (
    <Stack>
      <Text variant="body">A page with header actions: New save opens the sub-page saves/new, and the filter is kept per page across restarts. Its menu entry sits under {bucket.title} in the title bar menu.</Text>
      {shown.length === 0 ? <EmptyState message="No save matches the filter." /> : shown.map((save) => <StatRow key={save.name} label={save.name} value={save.when} />)}
    </Stack>
  );
};

export default SavesPage;
export { meta };
