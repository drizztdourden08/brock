/* @layer renderer-shell @kind component */
import { Flex, Status, Text } from '@drizztdourden08/tessera/primitives';
import { sourceLabel } from '../../behavior/source-label';
import { sourceTone } from '../../behavior/source-tone';
import type { QueueEntryProps } from './QueueEntry.type';

const QueueEntry = ({ line, active }: QueueEntryProps) => (
  <Flex gap="sm" align="center">
    <Status tone={sourceTone(line.source)} variant="pill">{sourceLabel(line.source)}</Status>
    <Text tone={active ? undefined : 'muted'}>{line.message}</Text>
  </Flex>
);

export { QueueEntry };
