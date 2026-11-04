/* @layer core @kind types */
type MessageKind = 'item' | 'hint' | 'chat' | 'server' | 'join';

interface RoomMessage {
  id: number;
  kind: MessageKind;
  text: string;
  at: number;
}

export type { MessageKind, RoomMessage };
