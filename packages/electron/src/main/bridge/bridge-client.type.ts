/* @layer electron-main @kind types */
import type { InvokeSignature, VoidSignature } from '@drizztdourden08/brock-core/ipc';
import type { BridgeEvent, BridgeReply, BridgeRequestId, BridgeRequestRoute } from './bridge.type';

interface BridgeClientOptions {
  app?: string;
  instance?: string;
  file?: string;
  maxMessageBytes?: number;
  timeoutMs?: number;
  handshakeMs?: number;
}

interface BridgeClient {
  request: <F extends InvokeSignature>(route: BridgeRequestRoute<F>, ...args: Parameters<F>) => Promise<Awaited<ReturnType<F>>>;
  on: <F extends VoidSignature>(event: BridgeEvent<F>, listener: F) => () => void;
  connect: () => Promise<string>;
  close: () => void;
}

interface BridgeLink {
  connectionId: string;
  sign: (id: number, channel: string, args: string) => string;
  write: (line: string) => void;
  end: () => void;
}

interface BridgeLinkLimits {
  maxBytes: number;
  handshakeMs: number;
}

interface BridgeLinkEvents {
  onReply: (reply: BridgeReply) => void;
  onPush: (event: string, args: unknown[]) => void;
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

export type { BridgeClient, BridgeClientOptions, BridgeLink, BridgeLinkEvents, BridgeLinkLimits, PendingReplies, PendingWaiter };
