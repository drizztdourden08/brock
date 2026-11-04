/* @layer core @kind constants */
import type { MessageKind } from './message-log.type';

const KIND_OF_TYPE: Readonly<Record<string, MessageKind>> = {
  ItemSend: 'item',
  ItemCheat: 'item',
  Hint: 'hint',
  Chat: 'chat',
  ServerChat: 'chat',
  Join: 'join',
  Part: 'join',
};

export { KIND_OF_TYPE };
