/* @layer renderer-shell @kind logic */
const sourceOf = (probe: () => unknown): string => probe.toString().replace(/\s+/g, ' ').slice(0, 90);

export { sourceOf };
