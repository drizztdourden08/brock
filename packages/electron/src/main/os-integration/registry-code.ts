/* @layer electron-main @kind logic */

const codeOf = (value: unknown): number => (typeof value === 'number' ? value : -1);

export { codeOf };
