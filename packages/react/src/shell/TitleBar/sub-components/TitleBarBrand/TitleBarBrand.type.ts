/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface TitleBarBrandProps {
  productName: string;
  instanceName: string | null;
  logoSrc?: string;
  instanceLogoSrc?: string;
  children?: ReactNode;
}

export type { TitleBarBrandProps };
