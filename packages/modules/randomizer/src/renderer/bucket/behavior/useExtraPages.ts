/* @layer renderer-shell @kind logic */
import { currentShowContext, useProfilesStore } from '@drizztdourden08/brock-react';
import type { LivePage } from '@drizztdourden08/brock-react';
import { orderVisiblePages } from '../order-visible-pages';
import { useExtraPagesStore } from './useExtraPagesStore';

const useExtraPages = (): readonly LivePage[] => {
  const pages = useExtraPagesStore((state) => state.pages);
  useProfilesStore((state) => state.active);
  return orderVisiblePages(pages, currentShowContext());
};

export { useExtraPages };
