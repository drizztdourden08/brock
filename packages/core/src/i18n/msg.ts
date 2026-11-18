/* @layer core @kind logic */
import type { ArgsOf, MessageKey } from './message-key.type';
import type { MessageValues } from './message-values.type';
import type { Message } from './text.type';

const msg = <K extends MessageKey>(key: K, ...args: ArgsOf<K>): Message => {
  const values = args[0] as MessageValues | undefined;
  return values ? { key, values } : { key };
};

export { msg };
