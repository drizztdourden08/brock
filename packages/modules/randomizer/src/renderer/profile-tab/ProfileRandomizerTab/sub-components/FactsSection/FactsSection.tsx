/* @layer renderer-shell @kind component */
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import { SectionHeader, Stack } from '@drizztdourden08/tessera/primitives';
import type { FactsSectionProps } from './FactsSection.type';

const FactsSection = ({ title, facts }: FactsSectionProps) => (
  <Stack gap="sm">
    <SectionHeader title={title} level={4} />
    <FactsPanel groups={[facts]} layout="rows" label={title} />
  </Stack>
);

export { FactsSection };
