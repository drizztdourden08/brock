/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Card, Stack, StatRow } from '@drizztdourden08/tessera/primitives';
import type { NetworkSectionProps } from '../../NetworkView.type';
import { formatLastPacket } from '../../behavior/format-last-packet';
import { formatPing } from '../../behavior/format-ping';
import { HEALTH_TITLE, LAST_PACKET_LABEL, PING_LABEL } from './HealthSection.constants';

const HealthSection = ({ status }: NetworkSectionProps) => {
  const text = useText();
  return (
    <Card title={text(HEALTH_TITLE)}>
      <Stack gap="sm">
        <StatRow label={text(PING_LABEL)} value={formatPing(status.health.pingMs, text)} />
        <StatRow label={text(LAST_PACKET_LABEL)} value={formatLastPacket(status.health.lastPacketAt, text)} />
      </Stack>
    </Card>
  );
};

export { HealthSection };
