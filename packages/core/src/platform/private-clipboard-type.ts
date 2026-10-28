/* @layer core @kind logic */
import { PRIVATE_NAME } from './clipboard-types.constants';

const prefixOf = (productId: string): string => `application/x-${productId}-`;

const privateClipboardType = (productId: string, name: string): string => {
  if (!PRIVATE_NAME.test(name)) throw new Error(`"${name}" is not a plain clipboard type name: use lower case letters, digits, dots, plus signs and dashes`);
  return `${prefixOf(productId)}${name}`;
};

const isPrivateClipboardType = (productId: string, type: string): boolean =>
  type.startsWith(prefixOf(productId)) && PRIVATE_NAME.test(type.slice(prefixOf(productId).length));

export { isPrivateClipboardType, privateClipboardType };
