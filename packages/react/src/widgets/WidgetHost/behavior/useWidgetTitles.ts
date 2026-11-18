/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useText } from '../../../i18n';
import { resolveWidgetLabels } from '../../resolve-widget-labels';
import { useWidgetTitleStore } from '../../useWidgetTitleStore';
import type { WidgetDef } from '../../widget.type';

const useWidgetTitles = (definitions: readonly WidgetDef[]): readonly WidgetDef[] => {
  const titles = useWidgetTitleStore((s) => s.titles);
  const text = useText();
  return useMemo(() => resolveWidgetLabels(definitions, text, titles), [definitions, titles, text]);
};

export { useWidgetTitles };
