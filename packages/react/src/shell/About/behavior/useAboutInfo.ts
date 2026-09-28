/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useDebugText } from '../../../diagnostics/useDebugText';
import type { AboutInfo, AboutRow } from '../About.type';
import { NO_EXTRA_ROWS } from '../About.constants';

const useAboutInfo = (extraRows: readonly AboutRow[] = NO_EXTRA_ROWS): AboutInfo => {
  const { text, version, labels } = useDebugText();

  return useMemo(() => ({
    version,
    rows: [
      { label: 'Version', value: version },
      { label: 'Runtime', value: labels.runtime },
      { label: 'Engine', value: labels.engine },
      { label: 'Platform', value: labels.platform },
      ...extraRows,
    ],
    copyText: text,
  }), [version, labels, extraRows, text]);
};

export { useAboutInfo };
