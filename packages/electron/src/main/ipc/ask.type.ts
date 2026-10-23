/* @layer electron-main @kind types */
import type { BrowserWindow } from 'electron';
import type { AskContract } from '@drizztdourden08/brock-core/augment';
import type { AskArgs, AskReply } from '@drizztdourden08/brock-core/ipc';
import type { ChannelArg } from './handle.type';

type AskFn = <K extends keyof AskContract>(win: BrowserWindow, channel: ChannelArg<K>, ...args: AskArgs<K>) => Promise<AskReply<K>>;

type AskWithinFn = <K extends keyof AskContract>(timeoutMs: number, win: BrowserWindow, channel: ChannelArg<K>, ...args: AskArgs<K>) => Promise<AskReply<K>>;

interface PendingAsk {
  senderId: number;
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
  release: () => void;
}

export type { AskFn, AskWithinFn, PendingAsk };
