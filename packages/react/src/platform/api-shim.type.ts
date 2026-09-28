/* @layer renderer-shell @kind types */
import type { EventMap, InvokeMap, SendMap } from '@drizztdourden08/brock-core';

type AnyFn = (...args: unknown[]) => unknown;
type ShimWindow = Window & { api?: Record<string, unknown> };
type Returns = Record<string, () => unknown>;

interface ApiShimMaps {
  invoke: InvokeMap;
  send: SendMap;
  events: EventMap;
}

interface ApiShimOptions {
  listMethods?: readonly string[];
  returns?: Returns;
  helpers?: Record<string, unknown>;
}

export type { AnyFn, ApiShimMaps, ApiShimOptions, Returns, ShimWindow };
