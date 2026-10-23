/* @layer electron-main @kind types */
import type { Socket } from 'net';
import type { Stats } from 'fs';
import type { InvokeChannel, InvokeSignature } from '@drizztdourden08/brock-core/ipc';

type BridgeRoute<F extends InvokeSignature = InvokeSignature> = InvokeChannel<string, F>;

type BridgeHandler<F extends InvokeSignature> = (...args: Parameters<F>) => ReturnType<F> | Awaited<ReturnType<F>>;

type BridgeArgsCheck = (args: readonly unknown[]) => boolean;

interface BridgeRouteOptions {
  validate?: BridgeArgsCheck;
}

interface BridgeRouteEntry {
  call: (args: unknown[]) => unknown;
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
  maxPending?: number;
  handshakeMs?: number;
  onError?: (channel: string, error: unknown) => void;
}

interface BridgeServer {
  readonly endpoint: string;
  readonly secret: string;
  handle: <F extends InvokeSignature>(route: BridgeRoute<F>, handler: BridgeHandler<F>, options?: BridgeRouteOptions) => () => void;
  close: () => void;
}

interface BridgeSession {
  secret: string;
  routes: ReadonlyMap<string, BridgeRouteEntry>;
  maxMessageBytes: number;
  handshakeMs: number;
  onError: (channel: string, error: unknown) => void;
  admit: (socket: Socket) => boolean;
}

interface BridgeReplyWriter {
  send: (reply: BridgeReply) => void;
  refuse: (id: BridgeRequestId | null, error: string) => void;
}

interface BridgeClientOptions {
  app?: string;
  instance?: string;
  file?: string;
  maxMessageBytes?: number;
  timeoutMs?: number;
}

interface BridgeClient {
  request: <F extends InvokeSignature>(route: BridgeRoute<F>, ...args: Parameters<F>) => Promise<Awaited<ReturnType<F>>>;
  close: () => void;
}

interface BridgeLink {
  sign: (id: number, channel: string, args: string) => string;
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

type PathStat = Pick<Stats, 'isSymbolicLink' | 'isDirectory' | 'isSocket' | 'uid' | 'mode'>;

interface WindowsUser {
  name: string;
  sid: string;
}

type SystemToolRun = (exe: string, args: string[]) => string;

export type {
  BridgeArgsCheck, BridgeClient, BridgeClientOptions, BridgeDiscovery, BridgeHandler, BridgeHello, BridgeLink, BridgeLinkEvents, BridgeReply,
  BridgeReplyWriter, BridgeRequest, BridgeRequestId, BridgeRoute, BridgeRouteEntry, BridgeRouteOptions, BridgeServer, BridgeServerOptions,
  BridgeSession, DiscoveryHost, PathStat, PendingReplies, PendingWaiter, PrivateEndpoint, SystemToolRun, WindowsUser,
};
