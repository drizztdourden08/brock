/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { SettingsPreviewPlacement } from '../../../settings.type';

interface SettingsPreviewLayoutProps {
  preview?: ReactNode;
  placement?: SettingsPreviewPlacement;
  label?: Text;
  rowsLabel?: Text;
  children: ReactNode;
}

export type { SettingsPreviewLayoutProps };
