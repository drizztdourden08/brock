/* @layer renderer-shell @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { useText } from '@drizztdourden08/brock-react';
import { Button, Flex, Status, Text } from '@drizztdourden08/tessera/primitives';
import { useNetworkStatus } from '../../../../online/hooks/behavior/useNetworkStatus';
import { formatPing } from '../../behavior/format-ping';
import { useConnectionStatusMap } from '../../behavior/useConnectionStatusMap';
import { NOT_CONNECTED_LABEL, PILL_TITLE } from './NetworkPill.constants';
import type { NetworkPillProps } from './NetworkPill.type';

const NetworkPill = ({ onOpen }: NetworkPillProps) => {
  const text = useText();
  const statusMap = useConnectionStatusMap();
  const status = useNetworkStatus();
  const online = status === null ? 0 : status.players.filter((player) => player.online).length;

  return (
    <Button variant="ghost" size="sm" onClick={onOpen} title={text(PILL_TITLE)}>
      <Flex gap="sm" align="center">
        {status === null
          ? <Status tone="neutral" dot>{text(NOT_CONNECTED_LABEL)}</Status>
          : <Status map={statusMap} value={status.connection} dot />}
        {status !== null && status.connection === 'connected' && (
          <Text variant="caption">{text(msg('randomizer:network.pill.summary', { ping: formatPing(status.health.pingMs, text), online, total: status.players.length }))}</Text>
        )}
      </Flex>
    </Button>
  );
};

export { NetworkPill };
