/* @layer renderer-shell @kind component */
import { Stack, StatRow, Text } from '@drizztdourden08/tessera/primitives';
import type { PerformanceSectionProps } from '../PerformanceWidget.type';

const PerformanceSection = (props: PerformanceSectionProps) => {
  const { group } = props;
  return (
    <Stack gap="xs" className="performance-widget__section" data-section={group.id}>
      <Text as="h3" variant="label">{group.title}</Text>
      {group.rows.map((row) => <StatRow key={row.label} label={row.label} value={row.value} mono size="sm" />)}
    </Stack>
  );
};

export { PerformanceSection };
