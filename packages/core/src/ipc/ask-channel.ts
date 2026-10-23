/* @layer core @kind logic */
import type { AskChannel, InvokeSignature } from './channels.type';

const ask = <F extends InvokeSignature>() => <const C extends string>(channel: C): AskChannel<C, F> => ({ kind: 'ask', channel });

export { ask };
