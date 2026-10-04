/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { isReviewLaunch } from '../../../host/is-review-launch';
import { REVIEW_OPTIONS_SLICE } from '../../widget.constants';
import { useWidgetRelayStore } from '../../useWidgetRelayStore';
import { OPTIONS_BUTTON_SELECTOR } from '../WidgetWindow.constants';
import type { ReviewOptionsRequest } from '../WidgetWindow.type';

const isRequest = (value: unknown): value is ReviewOptionsRequest =>
  typeof value === 'object' && value !== null && 'id' in value && 'open' in value;

const useReviewOptions = (id: string, root: HTMLElement | null, show: (anchor: HTMLElement | null) => void): void => {
  const request = useWidgetRelayStore((s) => s.slices[REVIEW_OPTIONS_SLICE]);
  useEffect(() => {
    if (!isReviewLaunch() || !isRequest(request) || request.id !== id || !root) return;
    show(request.open ? root.querySelector<HTMLElement>(OPTIONS_BUTTON_SELECTOR) : null);
  }, [request, id, root, show]);
};

export { useReviewOptions };
