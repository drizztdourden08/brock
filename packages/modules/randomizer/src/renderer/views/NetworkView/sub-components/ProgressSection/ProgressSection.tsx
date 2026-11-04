/* @layer renderer-shell @kind component */
import { Card, ProgressBar, Stack, StatRow } from '@drizztdourden08/tessera/primitives';
import type { NetworkSectionProps } from '../../network-section-props.type';
import { CHECKED_LABEL, PROGRESS_TITLE, RECEIVED_LABEL } from './ProgressSection.constants';

const ProgressSection = ({ status }: NetworkSectionProps) => {
  const { checked, total, received } = status.progress;

  return (
    <Card title={PROGRESS_TITLE}>
      <Stack gap="sm">
        <ProgressBar value={checked} max={Math.max(total, 1)} label={CHECKED_LABEL} showValue />
        <StatRow label={CHECKED_LABEL} value={`${checked} / ${total}`} />
        <StatRow label={RECEIVED_LABEL} value={received} />
      </Stack>
    </Card>
  );
};

export { ProgressSection };
