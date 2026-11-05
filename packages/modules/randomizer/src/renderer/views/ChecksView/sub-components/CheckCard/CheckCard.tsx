/* @layer renderer-shell @kind component */
import { ContextMenu } from '@drizztdourden08/tessera/composites';
import { Card, Flex, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { markMenu } from '../../behavior/mark-menu';
import { STATUS_MAP } from '../../ChecksView.constants';
import { CheckArt } from '../CheckArt';
import { CheckBadges } from '../CheckBadges';
import type { CheckCardProps } from './CheckCard.type';

const CheckCard = ({ row, onToggle }: CheckCardProps) => {
  const isEvent = row.kind === 'event';
  const title = isEvent ? row.label : (row.itemLabel ?? '???');
  return (
    <ContextMenu groups={markMenu(row, onToggle)}>
      <Card>
        <Flex gap="sm" align="center">
          <CheckArt src={row.art} alt={title} />
          <Stack gap="2xs">
            <Text>{title}</Text>
            <Text variant="caption">{isEvent ? 'Event' : row.label}</Text>
          </Stack>
          <Status map={STATUS_MAP} value={row.status} variant="pill" />
          <CheckBadges badges={row.badges} />
        </Flex>
      </Card>
    </ContextMenu>
  );
};

export { CheckCard };
