/* @layer core @kind logic */
import { PRIVATE_NAME } from './clipboard-types.constants';
import { privateClipboardPrefix } from './private-clipboard-prefix';

const privateClipboardType = (productId: string, name: string): string => {
  if (!PRIVATE_NAME.test(name)) throw new Error(`"${name}" is not a plain clipboard type name: use lower case letters, digits, dots and plus signs, with no dash`);
  return `${privateClipboardPrefix(productId)}${name}`;
};

export { privateClipboardType };
