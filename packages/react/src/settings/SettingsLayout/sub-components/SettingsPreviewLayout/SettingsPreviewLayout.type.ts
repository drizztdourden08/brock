/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { SettingsPreviewPlacement } from '../../../settings.type';

interface SettingsPreviewLayoutProps {
  preview?: ReactNode;
  placement?: SettingsPreviewPlacement;
  label?: string;
  rowsLabel?: string;
  children: ReactNode;
}

export type { SettingsPreviewLayoutProps };
