/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface HeaderSearch {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface HeaderPrimary {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

interface HeaderActionsProps {
  search?: HeaderSearch;
  primary?: HeaderPrimary;
  children?: ReactNode;
}

export type { HeaderActionsProps, HeaderPrimary, HeaderSearch };
