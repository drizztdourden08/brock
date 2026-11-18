/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { Text } from '@drizztdourden08/brock-core/i18n';

interface GuidedExtras {
  clickHint: ReactNode;
  text: (value: Text) => string;
}

export type { GuidedExtras };
