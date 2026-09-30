/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { bugReport } from '../../../bug-report/bug-report';
import type { SearchAction } from '../../../search/search.type';

const useStandardActions = (): SearchAction[] => useMemo(() => [
  {
    id: 'report-bug',
    label: 'Report a bug',
    keywords: 'bug issue problem feedback github',
    run: bugReport.open,
  },
], []);

export { useStandardActions };
