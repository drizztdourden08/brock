/* @layer electron-main @kind types */
import type { InvokeContract, SendContract, EventContract } from '@drizztdourden08/brock-core/augment';

type InvokeFn = <K extends keyof InvokeContract>(channel: K, ...args: Parameters<InvokeContract[K]>) => ReturnType<InvokeContract[K]>;
type SendFn = <K extends keyof SendContract>(channel: K, ...args: Parameters<SendContract[K]>) => void;
type SubscribeFn = <K extends keyof EventContract>(channel: K, callback: EventContract[K]) => () => void;

export type { InvokeFn, SendFn, SubscribeFn };
