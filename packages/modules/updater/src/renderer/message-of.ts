/* @layer renderer-shell @kind logic */
const messageOf = (err: unknown): string => (err instanceof Error ? err.message : String(err));

export { messageOf };
