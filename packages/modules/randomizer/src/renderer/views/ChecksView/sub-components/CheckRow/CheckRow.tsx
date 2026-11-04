/* @layer renderer-shell @kind component */
import { ContextMenu } from '@drizztdourden08/tessera/composites';
import { Flex, Status, Text } from '@drizztdourden08/tessera/primitives';
import { markMenu } from '../../behavior/mark-menu';
import { STATUS_MAP } from '../../ChecksView.constants';
import type { CheckRowProps } from './CheckRow.type';

const CheckRow = ({ row, onToggle }: CheckRowProps) => (
  <ContextMenu groups={markMenu(row, onToggle)}>
    <Flex align="center" gap="sm">
      <Status map={STATUS_MAP} value={row.status} dot />
      <Text>{row.label}</Text>
      {row.item !== null && <Text variant="caption">{row.item}</Text>}
    </Flex>
  </ContextMenu>
);

export { CheckRow };
