/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Card, ProgressBar, Stack, StatRow } from '@drizztdourden08/tessera/primitives';
import type { NetworkSectionProps } from '../../NetworkView.type';
import { CHECKED_LABEL, PROGRESS_TITLE, RECEIVED_LABEL } from './ProgressSection.constants';

const ProgressSection = ({ status }: NetworkSectionProps) => {
  const text = useText();
  const { checked, total, received } = status.progress;

  return (
    <Card title={text(PROGRESS_TITLE)}>
      <Stack gap="sm">
        <ProgressBar value={checked} max={Math.max(total, 1)} label={text(CHECKED_LABEL)} showValue />
        <StatRow label={text(CHECKED_LABEL)} value={`${checked} / ${total}`} />
        <StatRow label={text(RECEIVED_LABEL)} value={received} />
      </Stack>
    </Card>
  );
};

export { ProgressSection };
