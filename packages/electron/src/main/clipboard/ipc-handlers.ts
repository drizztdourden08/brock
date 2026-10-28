/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { electronClipboard } from './electron-clipboard';
import { registerClipboard } from './register-clipboard';

const clipboardHandlers: HandlerGroup = {
  id: 'clipboard',
  register: (ctx) => registerClipboard(ctx, electronClipboard(`application/x-${ctx.product.id}-`)),
};

export { clipboardHandlers };
