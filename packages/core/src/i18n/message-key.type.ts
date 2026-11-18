/* @layer core @kind types */
import type { Messages } from '../augment';
import type { MessageValues } from './message-values.type';

type MessageKey = keyof Messages extends never ? string : Extract<keyof Messages, string>;

type ValuesOf<K extends string> = K extends keyof Messages ? Messages[K] : MessageValues;

type ArgsOf<K extends string> = Record<never, never> extends ValuesOf<K> ? [values?: ValuesOf<K>] : [values: ValuesOf<K>];

export type { MessageKey, ValuesOf, ArgsOf };
