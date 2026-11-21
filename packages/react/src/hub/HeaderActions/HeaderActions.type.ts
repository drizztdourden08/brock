/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { Text } from '@drizztdourden08/brock-core/i18n';

interface HeaderSearch {
  value: string;
  onChange: (value: string) => void;
  placeholder?: Text;
}

interface HeaderPrimary {
  label: Text;
  icon?: ReactNode;
  onClick: () => void;
}

interface HeaderActionsProps {
  search?: HeaderSearch;
  secondary?: HeaderPrimary;
  primary?: HeaderPrimary;
  children?: ReactNode;
}

export type { HeaderActionsProps, HeaderPrimary, HeaderSearch };
