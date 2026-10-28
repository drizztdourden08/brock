/* @layer core @kind logic */
import { PRIVATE_NAME } from './clipboard-types.constants';
import { privateClipboardPrefix } from './private-clipboard-prefix';

const isPrivateClipboardType = (productId: string, type: string): boolean => {
  const prefix = privateClipboardPrefix(productId);
  return type.startsWith(prefix) && PRIVATE_NAME.test(type.slice(prefix.length));
};

export { isPrivateClipboardType };
