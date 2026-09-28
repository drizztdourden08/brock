/* @layer renderer-shell @kind types */
import type { KeyboardEvent, RefObject } from 'react';
import type { MenuEntry } from '../../menu/menu.type';
import type { SearchAction, SearchEntry } from '../palette.type';

interface SearchPaletteProps {
  menu: readonly MenuEntry[];
  actions?: readonly SearchAction[];
}

interface SearchPaletteModel {
  open: boolean;
  query: string;
  setQuery: (query: string) => void;
  items: SearchEntry[];
  idle: boolean;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  runEntry: (entry: SearchEntry) => void;
  close: () => void;
}

export type { SearchPaletteModel, SearchPaletteProps };
