/* @layer renderer-shell @kind logic */
import type { KeyboardEvent } from 'react';

const keepSearchOnEscape = (query: string) => (e: KeyboardEvent<HTMLElement>): void => {
  if (e.key === 'Escape' && query !== '') e.stopPropagation();
};

export { keepSearchOnEscape };
