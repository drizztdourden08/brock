/* @layer core @kind logic */
import type { InvokeChannel, InvokeSignature } from './channels.type';

const invoke = <F extends InvokeSignature>() => <const C extends string>(channel: C): InvokeChannel<C, F> => ({ kind: 'invoke', channel });

export { invoke };
