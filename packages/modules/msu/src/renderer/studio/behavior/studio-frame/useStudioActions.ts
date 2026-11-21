/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useT } from '@drizztdourden08/brock-react';
import type { StudioActionGroup } from '../../../studio-kit';
import type { StudioActionsParams } from './studio-frame.type';

const useStudioActions = (params: StudioActionsParams): StudioActionGroup[] => {
  const { busy, exporting, onExport } = params;
  const t = useT();

  return useMemo<StudioActionGroup[]>(() => [{
    id: 'export',
    label: t('msu:export.group'),
    actions: [
      {
        id: 'export-msul',
        label: exporting === 'msul' ? t('msu:export.running') : t('msu:export.msul'),
        variant: 'primary',
        disabled: busy,
        onSelect: () => { onExport('msul'); },
      },
      {
        id: 'export-msu1',
        label: exporting === 'msu1' ? t('msu:export.running') : t('msu:export.msu1'),
        disabled: busy,
        onSelect: () => { onExport('msu1'); },
      },
    ],
  }], [busy, exporting, onExport, t]);
};

export { useStudioActions };
