/* @layer renderer-shell @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { useText } from '@drizztdourden08/brock-react';
import { Card, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { useDeliveryQueue } from './behavior/useDeliveryQueue';
import { visibleLinesOf } from './behavior/visible-lines-of';
import { INCOMING_TITLE, MAX_VISIBLE } from './DeliveryQueueIndicator.constants';
import type { DeliveryQueueIndicatorProps } from './DeliveryQueueIndicator.type';
import { QueueEntry } from './sub-components/QueueEntry';

const DeliveryQueueIndicator = ({ title, maxVisible = MAX_VISIBLE }: DeliveryQueueIndicatorProps) => {
  const text = useText();
  const snapshot = useDeliveryQueue();
  const { delivering, pending } = snapshot;
  const total = pending.length + (delivering === null ? 0 : 1);
  if (total === 0) return null;
  const { shown, overflow } = visibleLinesOf(snapshot, maxVisible);

  return (
    <Card title={title ?? text(INCOMING_TITLE)} count={total} tone="info">
      <Stack gap="2xs">
        {delivering !== null && <QueueEntry line={delivering} active />}
        {shown.map((line) => (
          <QueueEntry key={line.id} line={line} active={false} />
        ))}
        {overflow > 0 && <Text variant="caption" tone="muted">{text(msg('randomizer:deliveries.overflow', { count: overflow }))}</Text>}
      </Stack>
    </Card>
  );
};

export { DeliveryQueueIndicator };
