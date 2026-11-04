/* @layer renderer-shell @kind component */
import { Card, Stack, StatRow } from '@drizztdourden08/tessera/primitives';
import type { NetworkSectionProps } from '../../network-section-props.type';
import { formatLastPacket, formatPing } from './format-health';
import { HEALTH_TITLE, LAST_PACKET_LABEL, PING_LABEL } from './HealthSection.constants';

const HealthSection = ({ status }: NetworkSectionProps) => (
  <Card title={HEALTH_TITLE}>
    <Stack gap="sm">
      <StatRow label={PING_LABEL} value={formatPing(status.health.pingMs)} />
      <StatRow label={LAST_PACKET_LABEL} value={formatLastPacket(status.health.lastPacketAt)} />
    </Stack>
  </Card>
);

export { HealthSection };
