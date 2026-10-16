/* @layer renderer-shell @kind logic */
const mediaOf = (query: string): MediaQueryList | null =>
  (typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(query) : null);

export { mediaOf };
