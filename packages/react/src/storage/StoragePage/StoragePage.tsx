/* @layer renderer-shell @kind component */
import { useMemo, useState } from 'react';
import { LoadError, SettingsSection } from '@drizztdourden08/tessera/composites';
import { EmptyState, Stack } from '@drizztdourden08/tessera/primitives';
import { useActionRunner } from '../../settings/SettingsLayout/behavior/useActionRunner';
import { useSearchEntries } from '../../search/useSearchEntries';
import { storageSearchEntries } from './behavior/storage-search-entries';
import { storageSections } from './behavior/storage-sections';
import { useStorageActions } from './behavior/useStorageActions';
import { useStorageDomains } from './behavior/useStorageDomains';
import { STORAGE_LOAD_FAILED } from './StoragePage.constants';
import type { StoragePageProps } from './StoragePage.type';

const StoragePage = (props: StoragePageProps) => {
  const state = useStorageDomains(props.domains);
  const actions = useStorageActions(state.refresh);
  const runner = useActionRunner();
  const [picked, setPicked] = useState<readonly string[] | null>(null);
  const chosen = picked ?? state.domains.filter((def) => def.portable !== false).map((def) => def.domain);
  const sections = storageSections({ state, actions, chosen, onChoose: setPicked, runner });
  useSearchEntries(useMemo(() => storageSearchEntries(state.domains), [state.domains]));

  if (!state.available) return <EmptyState message="Storage is only available in the desktop app." />;
  return (
    <Stack gap="lg" data-storage-page>
      {state.failure !== null && (
        <LoadError variant="box" message={STORAGE_LOAD_FAILED} error={state.failure.error} onRetry={() => state.refresh()} retrying={state.loading} />
      )}
      {sections.map((section) => <SettingsSection key={section.id} {...section} />)}
    </Stack>
  );
};

export { StoragePage };
