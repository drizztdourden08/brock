/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import type { ReportSectionProps } from './ReportSection.type';

const ReportSection = (props: ReportSectionProps) => {
  const { section: Section, setExtras, disabled } = props;
  if (Section === null) return null;
  return (
    <Box className="bug-report__section">
      <Section setExtras={setExtras} disabled={disabled} />
    </Box>
  );
};

export { ReportSection };
