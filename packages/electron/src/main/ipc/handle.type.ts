/* @layer electron-main @kind types */
import type { BrowserWindow, IpcMainInvokeEvent, IpcMainEvent } from 'electron';
import type { InvokeContract, SendContract, EventContract } from '@drizztdourden08/brock-core/augment';

type InvokeHandler<K extends keyof InvokeContract> = (
  event: IpcMainInvokeEvent,
  ...args: Parameters<InvokeContract[K]>
) => ReturnType<InvokeContract[K]> | Awaited<ReturnType<InvokeContract[K]>>;

type SendHandler<K extends keyof SendContract> = (
  event: IpcMainEvent,
  ...args: Parameters<SendContract[K]>
) => void;

type HandleFn = <K extends keyof InvokeContract>(channel: K, fn: InvokeHandler<K>) => void;
type OnFn = <K extends keyof SendContract>(channel: K, fn: SendHandler<K>) => void;
type EmitFn = <K extends keyof EventContract>(win: BrowserWindow, channel: K, ...args: Parameters<EventContract[K]>) => void;

export type { HandleFn, OnFn, EmitFn, InvokeHandler, SendHandler };
