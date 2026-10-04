/* @layer core @kind logic */
import type { EventChannel, VoidSignature } from './channels.type';

const event = <F extends VoidSignature>() => <const C extends string>(channel: C): EventChannel<C, F> => ({ kind: 'event', channel });

export { event };
