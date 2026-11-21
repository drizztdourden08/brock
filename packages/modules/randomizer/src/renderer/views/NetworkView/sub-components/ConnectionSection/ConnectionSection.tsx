/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Card, StatRow, Status } from '@drizztdourden08/tessera/primitives';
import { useConnectionStatusMap } from '../../behavior/useConnectionStatusMap';
import type { NetworkSectionProps } from '../../NetworkView.type';
import { CONNECTION_TITLE, STATE_LABEL } from './ConnectionSection.constants';

const ConnectionSection = ({ status }: NetworkSectionProps) => {
  const text = useText();
  const map = useConnectionStatusMap();
  return (
    <Card title={text(CONNECTION_TITLE)}>
      <StatRow label={text(STATE_LABEL)} value={<Status map={map} value={status.connection} dot />} />
    </Card>
  );
};

export { ConnectionSection };
