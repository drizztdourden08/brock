/* @layer renderer-shell @kind types */
import type { OpenRequest } from '@drizztdourden08/brock-core';

type AppOpenHandler = (request: OpenRequest) => void;

interface AppOpenRegistry {
  on: (handler: AppOpenHandler) => () => void;
  dispatch: (request: OpenRequest) => void;
}

export type { AppOpenHandler, AppOpenRegistry };
