/* @layer renderer-shell @kind logic */
const errorText = (error: unknown): string => (error instanceof Error ? error.message : String(error));

export { errorText };
