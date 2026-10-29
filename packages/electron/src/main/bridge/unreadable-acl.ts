/* @layer electron-main @kind logic */
const unreadableAcl = (error: unknown): string => `could not read its owner and access list: ${error instanceof Error ? error.message : String(error)}`;

export { unreadableAcl };
