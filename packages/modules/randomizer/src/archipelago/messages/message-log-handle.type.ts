/* @layer core @kind types */
import type { MessageKind, RoomMessage } from './message-log.type';

type MessageListener = (messages: readonly RoomMessage[]) => void;

interface MessageLog {
  readonly messages: readonly RoomMessage[];
  push(kind: MessageKind, text: string): void;
  clear(): void;
  onChange(listener: MessageListener): () => void;
}

export type { MessageListener, MessageLog };
