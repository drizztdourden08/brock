/* @layer renderer-shell @kind component */
import { Button, Flex, Status, Text } from '@drizztdourden08/tessera/primitives';
import { useNetworkStatus } from '../../../../online/hooks/behavior/useNetworkStatus';
import { formatPing } from '../../behavior/format-ping';
import { CONNECTION_STATUS } from '../ConnectionSection/ConnectionSection.constants';
import { NOT_CONNECTED_LABEL, PILL_TITLE } from './NetworkPill.constants';
import type { NetworkPillProps } from './NetworkPill.type';

const NetworkPill = ({ onOpen }: NetworkPillProps) => {
  const status = useNetworkStatus();
  const online = status === null ? 0 : status.players.filter((player) => player.online).length;

  return (
    <Button variant="ghost" size="sm" onClick={onOpen} title={PILL_TITLE}>
      <Flex gap="sm" align="center">
        {status === null
          ? <Status tone="neutral" dot>{NOT_CONNECTED_LABEL}</Status>
          : <Status map={CONNECTION_STATUS} value={status.connection} dot />}
        {status !== null && status.connection === 'connected' && (
          <Text variant="caption">{`ping ${formatPing(status.health.pingMs)}, ${online} / ${status.players.length} online`}</Text>
        )}
      </Flex>
    </Button>
  );
};

export { NetworkPill };
