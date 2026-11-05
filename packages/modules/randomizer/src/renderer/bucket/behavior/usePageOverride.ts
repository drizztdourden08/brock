/* @layer renderer-shell @kind logic */
import type { ReactNode } from 'react';
import { OVERRIDE_RENDER_CONTEXT } from '../builtin-page-ids.constants';
import { findPageOverride } from '../find-page-override';
import { useExtraPagesStore } from './useExtraPagesStore';

const usePageOverride = (key: string): ReactNode | null => {
  const pages = useExtraPagesStore((state) => state.pages);
  return findPageOverride(pages, key)?.render(OVERRIDE_RENDER_CONTEXT) ?? null;
};

export { usePageOverride };
