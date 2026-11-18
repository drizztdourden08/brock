/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useT } from '../../../i18n';
import { useDebugText } from '../../../diagnostics/useDebugText';
import type { AboutInfo, AboutRow } from '../About.type';
import { NO_EXTRA_ROWS } from '../About.constants';

const useAboutInfo = (extraRows: readonly AboutRow[] = NO_EXTRA_ROWS): AboutInfo => {
  const { text, version, labels } = useDebugText();
  const t = useT();

  return useMemo(() => ({
    version,
    rows: [
      { label: t('brock-shell:about.version'), value: version },
      { label: t('brock-shell:about.runtime'), value: labels.runtime },
      { label: t('brock-shell:about.engine'), value: labels.engine },
      { label: t('brock-shell:about.platform'), value: labels.platform },
      ...extraRows,
    ],
    copyText: text,
  }), [version, labels, extraRows, text, t]);
};

export { useAboutInfo };
