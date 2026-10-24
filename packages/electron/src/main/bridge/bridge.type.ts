/* @layer electron-main @kind types */
import type { Stats } from 'fs';
import type { AskChannel, EventChannel, InvokeChannel, InvokeSignature, VoidSignature } from '@drizztdourden08/brock-core/ipc';

type BridgeRoute<F extends InvokeSignature = InvokeSignature> = InvokeChannel<string, F>;

type BridgeRequestRoute<F extends InvokeSignature = InvokeSignature> = BridgeRoute<F> | AskChannel<string, F>;

type BridgeEvent<F extends VoidSignature = VoidSignature> = EventChannel<string, F>;

type BridgeHandler<F extends InvokeSignature> = (...args: Parameters<F>) => ReturnType<F> | Awaited<ReturnType<F>>;

interface BridgeCall {
  connectionId: string;
}

type BridgeCallHandler<F extends InvokeSignature> = (call: BridgeCall, ...args: Parameters<F>) => ReturnType<F> | Awaited<ReturnType<F>>;

type BridgeArgsCheck = (args: readonly unknown[]) => boolean;

interface BridgeRouteOptions {
  validate?: BridgeArgsCheck;
}

interface BridgeRouteEntry {
  call: (args: unknown[], call: BridgeCall) => unknown;
  validate: BridgeArgsCheck | null;
}

type BridgeRequestId = string | number;

interface BridgeRequest {
  id: number;
  channel: string;
  args: string;
  mac: string;
}

interface BridgeHello {
  nonce: string;
  proof: string | null;
}

interface BridgeErrorOptions {
  code?: string;
  data?: unknown;
}

type BridgeReply =
  | { id: BridgeRequestId | null; ok: true; value: unknown }
  | { id: BridgeRequestId | null; ok: false; error: string; code?: string; data?: unknown };

type BridgeServerMessage =
  | ({ type: 'reply' } & BridgeReply)
  | { type: 'push'; seq: number; event: string; args: unknown[] }
  | { type: 'ready'; connectionId: string };

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
  maxPending?: number;
  maxBufferedBytes?: number;
  handshakeMs?: number;
  onError?: (channel: string, error: unknown) => void;
}

type BridgeConnectionListener = (connectionId: string) => void;

interface BridgeServer {
  readonly endpoint: string;
  readonly secret: string;
  handle: <F extends InvokeSignature>(route: BridgeRoute<F>, handler: BridgeHandler<F>, options?: BridgeRouteOptions) => () => void;
  handleWith: <F extends InvokeSignature>(route: BridgeRoute<F>, handler: BridgeCallHandler<F>, options?: BridgeRouteOptions) => () => void;
  onOpen: (listener: BridgeConnectionListener) => () => void;
  onClose: (listener: BridgeConnectionListener) => () => void;
  connections: () => string[];
  emit: <F extends VoidSignature>(event: BridgeEvent<F>, ...args: Parameters<F>) => number;
  emitTo: <F extends VoidSignature>(connectionId: string, event: BridgeEvent<F>, ...args: Parameters<F>) => number;
  close: () => void;
}

interface BridgeConnectionLink {
  push: (event: string, args: unknown[]) => boolean;
}

interface BridgeWriteLimits {
  maxMessageBytes: number;
  maxBufferedBytes: number;
}

interface BridgeSession extends BridgeWriteLimits {
  secret: string;
  routes: ReadonlyMap<string, BridgeRouteEntry>;
  handshakeMs: number;
  onError: (channel: string, error: unknown) => void;
  admit: (link: BridgeConnectionLink) => string | null;
  release: (connectionId: string) => void;
}

interface BridgeReplyWriter {
  signed: (key: string, message: BridgeServerMessage) => boolean;
  refuse: (id: BridgeRequestId | null, error: string) => void;
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

type PathStat = Pick<Stats, 'isSymbolicLink' | 'isDirectory' | 'isSocket' | 'uid' | 'mode'>;

interface WindowsUser {
  sid: string;
}

interface SystemToolOptions {
  cwd?: string;
  env?: Record<string, string>;
}

type SystemToolRun = (exe: string, args: string[], options?: SystemToolOptions) => Buffer;

export type {
  BridgeArgsCheck, BridgeCall, BridgeCallHandler, BridgeConnectionLink, BridgeConnectionListener, BridgeDiscovery, BridgeErrorOptions, BridgeEvent,
  BridgeHandler, BridgeHello, BridgeReply, BridgeReplyWriter, BridgeRequest, BridgeRequestId, BridgeRoute, BridgeRouteEntry, BridgeRouteOptions,
  BridgeRequestRoute, BridgeServer, BridgeServerMessage, BridgeServerOptions, BridgeSession, BridgeWriteLimits, DiscoveryHost, PathStat, PrivateEndpoint, SystemToolRun, WindowsUser,
};
