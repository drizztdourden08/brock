/* @layer renderer-shell @kind types */
import type { KeyboardEvent, RefObject } from 'react';

interface SearchInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  resultCount: number;
}

export type { SearchInputProps };
