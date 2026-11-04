/* @layer renderer-shell @kind component */
import { Card, Stack, StatRow } from '@drizztdourden08/tessera/primitives';
import { NONE_LABEL, UNKNOWN_LABEL } from '../../NetworkView.constants';
import type { NetworkSectionProps } from '../../network-section-props.type';
import { SEED_LABEL, SERVER_TITLE, TAGS_LABEL, VERSION_LABEL } from './ServerSection.constants';

const ServerSection = ({ status }: NetworkSectionProps) => {
  const { version, seedName, tags } = status.server;

  return (
    <Card title={SERVER_TITLE}>
      <Stack gap="sm">
        <StatRow label={VERSION_LABEL} value={version ?? UNKNOWN_LABEL} />
        <StatRow label={SEED_LABEL} value={seedName ?? UNKNOWN_LABEL} mono />
        <StatRow label={TAGS_LABEL} value={tags.length > 0 ? tags.join(', ') : NONE_LABEL} />
      </Stack>
    </Card>
  );
};

export { ServerSection };
