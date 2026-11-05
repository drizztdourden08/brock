/* @layer renderer-shell @kind component */
import { EmptyState, Grid } from '@drizztdourden08/tessera/primitives';
import { useNetworkStatus } from '../../online/hooks/behavior/useNetworkStatus';
import { PANEL_MIN_WIDTH } from '../dashboard/dashboard.constants';
import { NETWORK_PANELS, NO_STATUS_MESSAGE } from './NetworkView.constants';
import { ConnectionSection } from './sub-components/ConnectionSection';
import { HealthSection } from './sub-components/HealthSection';
import { PlayersSection } from './sub-components/PlayersSection';
import { ProgressSection } from './sub-components/ProgressSection';
import { ServerSection } from './sub-components/ServerSection';
import { ServerSetup } from './sub-components/ServerSetup';

const NetworkView = () => {
  const status = useNetworkStatus();

  return (
    <Grid minColWidth={PANEL_MIN_WIDTH} gap="lg" dense>
      <Grid.Cell span={NETWORK_PANELS.setup}><ServerSetup /></Grid.Cell>
      {status === null ? <Grid.Cell span="full"><EmptyState message={NO_STATUS_MESSAGE} /></Grid.Cell> : (
        <>
          <Grid.Cell span={NETWORK_PANELS.connection}><ConnectionSection status={status} /></Grid.Cell>
          <Grid.Cell span={NETWORK_PANELS.health}><HealthSection status={status} /></Grid.Cell>
          <Grid.Cell span={NETWORK_PANELS.progress}><ProgressSection status={status} /></Grid.Cell>
          <Grid.Cell span={NETWORK_PANELS.players}><PlayersSection status={status} /></Grid.Cell>
          <Grid.Cell span={NETWORK_PANELS.server}><ServerSection status={status} /></Grid.Cell>
        </>
      )}
    </Grid>
  );
};

export { NetworkView };
