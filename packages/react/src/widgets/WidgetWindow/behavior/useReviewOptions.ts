/* @layer renderer-shell @kind hook */
import { isReviewLaunch } from '../../../host/is-review-launch';
import { REVIEW_OPTIONS_SLICE } from '../../widget.constants';
import { useWidgetRelayStore } from '../../useWidgetRelayStore';
import type { ReviewOptionsRequest } from '../WidgetWindow.type';

const isRequest = (value: unknown): value is ReviewOptionsRequest =>
  typeof value === 'object' && value !== null && 'id' in value && 'open' in value;

const useReviewOptions = (id: string): boolean => {
  const request = useWidgetRelayStore((s) => s.slices[REVIEW_OPTIONS_SLICE]);
  return isReviewLaunch() && isRequest(request) && request.id === id && request.open;
};

export { useReviewOptions };
