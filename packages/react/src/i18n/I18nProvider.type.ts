/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { I18n } from '@drizztdourden08/brock-core/i18n';

type I18nProviderProps = { readonly i18n: I18n; readonly document?: boolean; readonly children: ReactNode };

export type { I18nProviderProps };
