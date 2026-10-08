/* @layer electron-main @kind types */
import type { OpenRequest, OpenSource } from '@drizztdourden08/brock-core/types';

interface OpenTargets {
  schemes: readonly string[];
  extensions: readonly string[];
}

interface OpenArgsContext {
  cwd: string;
  source: OpenSource;
}

type OpenHandler = (request: OpenRequest) => void;

interface OpenRouter {
  push: (requests: readonly OpenRequest[]) => void;
  onOpen: (handler: OpenHandler) => () => void;
  ready: (toRenderer: OpenHandler) => void;
  take: () => OpenRequest[];
}

interface LockInput {
  wanted: boolean | undefined;
  targets: OpenTargets;
  automation: boolean;
  namedInstance: boolean;
}

export type { LockInput, OpenArgsContext, OpenHandler, OpenRouter, OpenTargets };
