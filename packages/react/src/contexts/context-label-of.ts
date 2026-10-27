/* @layer renderer-shell @kind logic */
import type { AppContexts } from './contexts.type';

const contextLabelOf = (contexts: AppContexts, name: string | undefined): string | undefined => {
  const label = name === undefined ? undefined : contexts[name]?.label?.trim();
  return label === '' ? undefined : label;
};

export { contextLabelOf };
