/* @layer renderer-shell @kind component */
import { EmptyState, Stack } from '@drizztdourden08/tessera/primitives';
import { useNetworkStatus } from '../../online/hooks/behavior/useNetworkStatus';
import { NO_STATUS_MESSAGE } from './NetworkView.constants';
import { ConnectionSection } from './sub-components/ConnectionSection';
import { HealthSection } from './sub-components/HealthSection';
import { PlayersSection } from './sub-components/PlayersSection';
import { ProgressSection } from './sub-components/ProgressSection';
import { ServerSection } from './sub-components/ServerSection';
import { ServerSetup } from './sub-components/ServerSetup';

const NetworkView = () => {
  const status = useNetworkStatus();
  if (status === null) {
    return (
      <Stack gap="md">
        <ServerSetup />
        <EmptyState message={NO_STATUS_MESSAGE} />
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <ServerSetup />
      <ConnectionSection status={status} />
      <HealthSection status={status} />
      <ProgressSection status={status} />
      <PlayersSection status={status} />
      <ServerSection status={status} />
    </Stack>
  );
};

export { NetworkView };
