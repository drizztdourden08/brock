/* @layer core @kind types */
import type { ArchipelagoSocket } from '../protocol/socket.type';

type CreateSocket = (url: string) => ArchipelagoSocket;

interface SocketLinkHandlers {
  onOpen(url: string): void;
  onMessage(data: string): void;
  onClose(opened: boolean): void;
}

interface SocketLink {
  send(data: string): void;
  close(): boolean;
}

export type { CreateSocket, SocketLink, SocketLinkHandlers };
