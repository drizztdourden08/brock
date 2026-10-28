/* @layer core @kind constants */
import type { PlatformEventContract, PlatformInvokeContract } from './platform-contract.type';

const PLATFORM_INVOKE_MAP = {
  clipboardReadText: 'clipboard:readText',
  clipboardWrite: 'clipboard:write',
  clipboardRead: 'clipboard:read',
  clipboardWatch: 'clipboard:watch',
  clipboardUnwatch: 'clipboard:unwatch',
  netRead: 'net:read',
  dragOut: 'dnd:dragOut',
} as const satisfies Record<string, keyof PlatformInvokeContract>;

const PLATFORM_EVENT_MAP = {
  onClipboardChange: 'clipboard:changed',
} as const satisfies Record<string, keyof PlatformEventContract>;

export { PLATFORM_EVENT_MAP, PLATFORM_INVOKE_MAP };
