/* @layer electron-main @kind logic */
import type { ClipboardItemCtor } from './electron-clipboard.type';

const isClipboardItemCtor = (value: unknown): value is ClipboardItemCtor => typeof value === 'function';

const clipboardItemOf = (api: object): ClipboardItemCtor | null => {
  if (!('ClipboardItem' in api)) return null;
  const ctor = api.ClipboardItem;
  return isClipboardItemCtor(ctor) ? ctor : null;
};

export { clipboardItemOf };
