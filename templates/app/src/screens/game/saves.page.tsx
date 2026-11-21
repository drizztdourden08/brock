/* @layer renderer-app @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { usePageSearch, useT, useText } from '@drizztdourden08/brock-react';
import type { PageProps, ScreenMeta } from '@drizztdourden08/brock-react';
import { EmptyState, Stack, StatRow, Text } from '@drizztdourden08/tessera/primitives';

const meta: ScreenMeta = {
  title: msg('app:saves.title'),
  icon: 'save',
  order: 1,
  keywords: ['slots', 'progress'],
  menu: 'Game',
  header: { primary: { label: 'New save', icon: 'plus', open: 'new' }, search: { placeholder: 'Filter saves' } },
};

const SavesPage = (props: PageProps) => {
  const { bucket } = props;
  const t = useT();
  const text = useText();
  const filter = usePageSearch().trim().toLowerCase();
  const saves = [
    { name: t('app:saves.sample.camp'), when: t('app:saves.when.today') },
    { name: t('app:saves.sample.bridge'), when: t('app:saves.when.yesterday') },
  ];
  const shown = saves.filter((save) => save.name.toLowerCase().includes(filter));
  return (
    <Stack>
      <Text variant="body">{t('app:saves.body', { title: text(bucket.title) })}</Text>
      {shown.length === 0 ? <EmptyState message={t('app:saves.empty')} /> : shown.map((save) => <StatRow key={save.name} label={save.name} value={save.when} />)}
    </Stack>
  );
};

export default SavesPage;
export { meta };
