/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { AboutScreenOptions } from './AboutScreen';

interface BuiltInScreenOptions extends AboutScreenOptions {
  credits?: ReactNode;
  settings?: boolean;
}

export type { BuiltInScreenOptions };
