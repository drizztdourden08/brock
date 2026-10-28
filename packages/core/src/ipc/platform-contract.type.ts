/* @layer core @kind types */
import type { ClipboardWireEntries } from '../platform/ports/clipboard.type';
import type { NetReadOptions, NetReadWire } from '../platform/ports/net.type';

interface PlatformInvokeContract {
  'clipboard:readText': () => Promise<string>;
  'clipboard:write': (entries: ClipboardWireEntries) => Promise<void>;
  'clipboard:read': (types: string[]) => Promise<ClipboardWireEntries>;
  'clipboard:watch': (id: string) => Promise<void>;
  'clipboard:unwatch': (id: string) => Promise<void>;
  'net:read': (url: string, options?: NetReadOptions) => Promise<NetReadWire>;
  'dnd:dragOut': (paths: string[]) => Promise<void>;
}

interface PlatformEventContract {
  'clipboard:changed': () => void;
}

export type { PlatformEventContract, PlatformInvokeContract };
