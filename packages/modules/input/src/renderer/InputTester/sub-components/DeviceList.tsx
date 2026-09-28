/* @layer renderer-shell @kind component */
import { EmptyState, Flex } from '@drizztdourden08/tessera/primitives';
import { DeviceCard } from '../../DeviceCard';
import { UnavailableDevice } from './UnavailableDevice';
import type { DeviceListProps } from './DeviceList.type';

const DeviceList = (props: DeviceListProps) => {
  const { entries, available, loaded } = props;
  if (!loaded) return null;
  if (!available) return <EmptyState message="The SDL3 addon is not loaded, so no controller can be read." />;
  if (entries.length === 0) return <EmptyState message="No controller found. Plug one in, then rescan." />;

  return (
    <Flex direction="column" gap="md">
      {entries.map((entry) => (entry.status === 'ready'
        ? <DeviceCard key={entry.deviceKey} entry={entry} />
        : <UnavailableDevice key={entry.deviceKey} entry={entry} />))}
    </Flex>
  );
};

export { DeviceList };
