/* @layer renderer-shell @kind component */
import { Box, Button, Icon, Stack } from '@drizztdourden08/tessera/primitives';
import { REVIEW_MASK } from '@drizztdourden08/brock-core/review';
import { useWidgetPref } from '../../../../hooks/useWidgetPref';
import { DETAILS_PREF, PERFORMANCE_WIDGET_ID } from '../PerformanceWidget.constants';
import type { PerformanceDetailsProps } from '../PerformanceWidget.type';
import { PerformanceSection } from './PerformanceSection';

const PerformanceDetails = (props: PerformanceDetailsProps) => {
  const { groups } = props;
  const [open, setOpen] = useWidgetPref<boolean>(PERFORMANCE_WIDGET_ID, DETAILS_PREF, false);
  if (groups.length === 0) return null;

  return (
    <Box className="performance-widget__details" data-open={open ? 'true' : 'false'}>
      <Button
        className="performance-widget__details-toggle"
        size="sm"
        variant="ghost"
        aria-expanded={open}
        icon={<Icon name={open ? 'chevron-down' : 'chevron-right'} size={14} />}
        onClick={() => setOpen(!open)}
      >
        Details
      </Button>
      {open && (
        <Stack gap="md" className="performance-widget__details-body" {...REVIEW_MASK}>
          {groups.map((group) => <PerformanceSection key={group.id} group={group} />)}
        </Stack>
      )}
    </Box>
  );
};

export { PerformanceDetails };
