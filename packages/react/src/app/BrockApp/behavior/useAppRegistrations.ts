/* @layer renderer-shell @kind hook */
import { APP_FLAGS_SOURCE } from '../../../screens/show/show.constants';
import { useShowFlagsSource } from '../../../screens/show/useShowFlagsSource';
import { useBugReportTransport } from '../../../bug-report/useBugReportTransport';
import { useTourRegistry } from '../../../tours/useTourRegistry';
import type { TourDef } from '../../../tours/tour.type';
import type { BrockAppProps } from '../BrockApp.type';

const useAppRegistrations = (tours: readonly TourDef[], moduleTours: readonly TourDef[], props: Pick<BrockAppProps<object>, 'bugReport' | 'showFlags'>): void => {
  useTourRegistry(tours, moduleTours);
  useBugReportTransport(props.bugReport);
  useShowFlagsSource(APP_FLAGS_SOURCE, props.showFlags);
};

export { useAppRegistrations };
