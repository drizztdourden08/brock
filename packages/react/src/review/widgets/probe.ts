/* @layer renderer-shell @kind logic */
import type { WidgetProbeRequest, WidgetProbeResult } from '@drizztdourden08/brock-core';
import { requireHostApi } from '../../host/require-host-api';

const probe = (request: WidgetProbeRequest): Promise<WidgetProbeResult> => requireHostApi().reviewWidgetProbe(request);

export { probe };
