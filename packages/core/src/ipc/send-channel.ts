/* @layer core @kind logic */
import type { SendChannel, VoidSignature } from './channels.type';

const send = <F extends VoidSignature>() => <const C extends string>(channel: C): SendChannel<C, F> => ({ kind: 'send', channel });

export { send };
