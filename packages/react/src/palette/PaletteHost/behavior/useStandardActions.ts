/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { msg } from '@drizztdourden08/brock-core/i18n';
import { bugReport } from '../../../bug-report/bug-report';
import { useText } from '../../../i18n';
import type { SearchAction } from '../../../search/search.type';

const useStandardActions = (): SearchAction[] => {
  const text = useText();
  return useMemo(() => [
    {
      id: 'report-bug',
      label: text(msg('brock-shell:menu.reportBug')),
      keywords: 'bug issue problem feedback github',
      run: () => bugReport.open(),
    },
  ], [text]);
};

export { useStandardActions };
