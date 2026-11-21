/* @layer renderer-app @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { SearchAnchor, useT, useText } from '@drizztdourden08/brock-react';
import type { PageProps, ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { Stack, StatRow, Text } from '@drizztdourden08/tessera/primitives';

const meta: ScreenMeta = { title: msg('app:controls.title'), icon: 'keyboard', order: 2, keywords: ['bindings', 'keys', 'gamepad'] };

const searchEntries: SearchEntrySeed[] = [
  { label: 'Jump', keywords: ['space', 'button a'], anchor: 'jump', description: 'Space or button A' },
  { label: 'Interact', keywords: ['e', 'button x'], anchor: 'interact', description: 'E or button X' },
  { label: 'Pause', keywords: ['escape', 'start'], anchor: 'pause', description: 'Escape or Start' },
];

const ControlsPage = (props: PageProps) => {
  const { bucket } = props;
  const t = useT();
  const text = useText();
  return (
    <Stack>
      <Text variant="body">{t('app:controls.body', { title: text(bucket.title) })}</Text>
      {searchEntries.map((entry) => (
        <SearchAnchor key={text(entry.label)} anchor={entry.anchor ?? text(entry.label)}>
          <StatRow label={text(entry.label)} value={entry.description === undefined ? undefined : text(entry.description)} />
        </SearchAnchor>
      ))}
    </Stack>
  );
};

export default ControlsPage;
export { meta, searchEntries };
