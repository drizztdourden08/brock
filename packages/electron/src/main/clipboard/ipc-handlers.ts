/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { privateClipboardPrefix } from '@drizztdourden08/brock-core/platform';
import { electronClipboard } from './electron-clipboard';
import { registerClipboard } from './register-clipboard';

const clipboardHandlers: HandlerGroup = {
  id: 'clipboard',
  register: (ctx) => registerClipboard(ctx, electronClipboard(privateClipboardPrefix(ctx.product.id))),
};

export { clipboardHandlers };
