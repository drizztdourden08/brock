/* @layer electron-main @kind types */
import type { InvokeChannel, InvokeSignature } from '@drizztdourden08/brock-core/ipc';

type BridgeRoute<F extends InvokeSignature = InvokeSignature> = InvokeChannel<string, F>;

type BridgeHandler<F extends InvokeSignature> = (...args: Parameters<F>) => ReturnType<F> | Awaited<ReturnType<F>>;

type BridgeRouteFn = (args: unknown[]) => unknown;

type BridgeRequestId = string | number;

interface BridgeRequest {
  v: number;
  id: BridgeRequestId;
  secret: string;
  channel: string;
  args: unknown[];
}

type BridgeReply =
  | { id: BridgeRequestId | null; ok: true; value: unknown }
  | { id: BridgeRequestId | null; ok: false; error: string };

interface BridgeDiscovery {
  v: number;
  app: string;
  pid: number;
  endpoint: string;
  secret: string;
  startedAt: string;
}

interface BridgeServerOptions {
  app: string;
  maxMessageBytes?: number;
  maxClients?: number;
  firstMessageMs?: number;
}

interface BridgeServer {
  readonly endpoint: string;
  readonly secret: string;
  handle: <F extends InvokeSignature>(route: BridgeRoute<F>, handler: BridgeHandler<F>) => () => void;
  close: () => void;
}

interface BridgeSession {
  secret: string;
  routes: ReadonlyMap<string, BridgeRouteFn>;
  maxMessageBytes: number;
  firstMessageMs: number;
}

interface BridgeClientOptions {
  app?: string;
  file?: string;
  maxMessageBytes?: number;
  timeoutMs?: number;
}

interface BridgeClient {
  request: <F extends InvokeSignature>(route: BridgeRoute<F>, ...args: Parameters<F>) => Promise<Awaited<ReturnType<F>>>;
  close: () => void;
}

interface BridgeLink {
  secret: string;
  write: (line: string) => void;
  end: () => void;
}

interface BridgeLinkEvents {
  onReply: (reply: BridgeReply) => void;
  onClose: (error: Error) => void;
}

interface PendingWaiter {
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

interface PendingReplies {
  wait: (id: BridgeRequestId, channel: string, timeoutMs: number) => Promise<unknown>;
  settle: (reply: BridgeReply) => void;
  failAll: (error: Error) => void;
}

interface PrivateEndpoint {
  path: string;
  dir: string | null;
}

interface DiscoveryHost {
  env: Readonly<Record<string, string | undefined>>;
  platform: NodeJS.Platform;
  home: string;
}

export type {
  BridgeClient, BridgeClientOptions, BridgeDiscovery, BridgeHandler, BridgeLink, BridgeLinkEvents, BridgeReply, BridgeRequest, BridgeRequestId,
  BridgeRoute, BridgeRouteFn, BridgeServer, BridgeServerOptions, BridgeSession, DiscoveryHost, PendingReplies, PendingWaiter, PrivateEndpoint,
};
