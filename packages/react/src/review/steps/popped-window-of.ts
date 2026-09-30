/* @layer renderer-shell @kind logic */
import type { WidgetWindowInfo } from '@drizztdourden08/brock-core';
import { requireHostApi } from '../../host/require-host-api';

const poppedWindowOf = async (id: string): Promise<WidgetWindowInfo | null> =>
  (await requireHostApi().listPoppedWidgets()).find((info) => info.id === id) ?? null;

export { poppedWindowOf };
