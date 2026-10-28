/* @layer core @kind logic */
const privateClipboardPrefix = (productId: string): string => `application/x-${productId}-`;

export { privateClipboardPrefix };
