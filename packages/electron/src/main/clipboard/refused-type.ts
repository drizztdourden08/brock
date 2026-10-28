/* @layer electron-main @kind logic */
const refusedType = (productId: string, type: unknown): Error =>
  new Error(`The clipboard type ${JSON.stringify(type)} is not allowed: use text/plain, image/png or a type that starts with application/x-${productId}-`);

export { refusedType };
