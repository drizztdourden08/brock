/* @layer renderer-shell @kind component */
import { Flex, ProgressBar, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { BAR_LABEL, STATUS_MAP, STATUS_ORDER } from '../../ChecksView.constants';
import type { ChecksSummaryProps } from './ChecksSummary.type';

const percentOf = (done: number, total: number): number => (total > 0 ? Math.round((done / total) * 100) : 0);

const ChecksSummary = ({ counts }: ChecksSummaryProps) => (
  <Stack gap="xs">
    <ProgressBar
      value={counts.checked}
      secondaryValue={counts.checked + counts.available}
      secondaryTone="primary"
      tone="secondary"
      max={Math.max(counts.total, 1)}
      label={BAR_LABEL}
      showValue
      formatValue={() => `${percentOf(counts.checked, counts.total)}%`}
    />
    <Flex gap="md" wrap>
      {STATUS_ORDER.map((status) => (
        <Flex key={status} gap="xs" align="center" title={STATUS_MAP[status].label}>
          <Status map={STATUS_MAP} value={status} dot />
          <Text>{counts[status]}</Text>
          <Text tone="faint">{STATUS_MAP[status].label.toLowerCase()}</Text>
        </Flex>
      ))}
      <Flex gap="xs" align="center">
        <Text>{counts.total}</Text>
        <Text tone="faint">total</Text>
      </Flex>
    </Flex>
  </Stack>
);

export { ChecksSummary };
