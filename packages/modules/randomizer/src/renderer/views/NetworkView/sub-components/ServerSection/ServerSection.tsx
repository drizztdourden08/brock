/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Card, Stack, StatRow } from '@drizztdourden08/tessera/primitives';
import { NONE_LABEL, UNKNOWN_LABEL } from '../../NetworkView.constants';
import type { NetworkSectionProps } from '../../NetworkView.type';
import { SEED_LABEL, SERVER_TITLE, TAGS_LABEL, VERSION_LABEL } from './ServerSection.constants';

const ServerSection = ({ status }: NetworkSectionProps) => {
  const text = useText();
  const { version, seedName, tags } = status.server;

  return (
    <Card title={text(SERVER_TITLE)}>
      <Stack gap="sm">
        <StatRow label={text(VERSION_LABEL)} value={version ?? text(UNKNOWN_LABEL)} />
        <StatRow label={text(SEED_LABEL)} value={seedName ?? text(UNKNOWN_LABEL)} mono />
        <StatRow label={text(TAGS_LABEL)} value={tags.length > 0 ? tags.join(', ') : text(NONE_LABEL)} />
      </Stack>
    </Card>
  );
};

export { ServerSection };
