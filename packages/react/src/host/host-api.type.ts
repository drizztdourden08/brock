/* @layer renderer-shell @kind types */
import type { IpcApi } from '@drizztdourden08/brock-core';

type ApiWindow = Window & { api?: IpcApi };

export type { ApiWindow };
