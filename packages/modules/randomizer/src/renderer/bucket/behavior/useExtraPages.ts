/* @layer renderer-shell @kind logic */
import type { LivePage } from '@drizztdourden08/brock-react';
import { useExtraPagesStore } from './useExtraPagesStore';

const useExtraPages = (): readonly LivePage[] => useExtraPagesStore((state) => state.pages);

export { useExtraPages };
