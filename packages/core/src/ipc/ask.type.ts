/* @layer core @kind types */
import type { AskContract } from '../augment';

type AskArgs<K extends keyof AskContract> = AskContract[K] extends (...args: infer A) => unknown ? A : never;
type AskReply<K extends keyof AskContract> = AskContract[K] extends (...args: never[]) => Promise<infer R> ? R : never;
type AskHandler<K extends keyof AskContract> = (...args: AskArgs<K>) => AskReply<K> | Promise<AskReply<K>>;

export type { AskArgs, AskReply, AskHandler };
