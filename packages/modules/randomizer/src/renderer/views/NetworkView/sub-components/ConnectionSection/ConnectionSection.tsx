/* @layer renderer-shell @kind component */
import { Card, StatRow, Status } from '@drizztdourden08/tessera/primitives';
import type { NetworkSectionProps } from '../../network-section-props.type';
import { CONNECTION_STATUS, CONNECTION_TITLE, STATE_LABEL } from './ConnectionSection.constants';

const ConnectionSection = ({ status }: NetworkSectionProps) => (
  <Card title={CONNECTION_TITLE}>
    <StatRow label={STATE_LABEL} value={<Status map={CONNECTION_STATUS} value={status.connection} dot />} />
  </Card>
);

export { ConnectionSection };
