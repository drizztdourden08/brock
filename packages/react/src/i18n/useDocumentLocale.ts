/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { Direction } from '@drizztdourden08/brock-core/i18n';

const useDocumentLocale = (locale: string, dir: Direction): void => {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);
};

export { useDocumentLocale };
