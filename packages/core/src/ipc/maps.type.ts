/* @layer core @kind types */
import type { InvokeContract, SendContract, EventContract } from '../augment';

type InvokeMap = Record<string, keyof InvokeContract>;
type SendMap = Record<string, keyof SendContract>;
type EventMap = Record<string, keyof EventContract>;

export type { InvokeMap, SendMap, EventMap };
