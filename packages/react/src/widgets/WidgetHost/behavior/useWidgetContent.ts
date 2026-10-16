/* @layer renderer-shell @kind hook */
import { createElement, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { WidgetBody } from '../../WidgetBody';
import { WidgetIdContext } from '../../widget-id-context';
import { widgetToolsOf } from '../../widget-tools-of';
import type { WidgetDef } from '../../widget.type';

const useWidgetContent = (definitions: readonly WidgetDef[]) => {
  const content = useMemo<Record<string, ReactNode>>(
    () => Object.fromEntries(definitions.map((def) => [def.id, createElement(WidgetBody, { id: def.id, label: def.label }, def.render())])),
    [definitions],
  );
  const settingsContent = useMemo<Record<string, ReactNode>>(
    () => Object.fromEntries(definitions.flatMap((def) => (def.settings ? [[def.id, createElement(WidgetIdContext.Provider, { value: def.id }, def.settings())]] : []))),
    [definitions],
  );
  const tools = useMemo<Record<string, ReactNode>>(() => Object.fromEntries(definitions.flatMap((def) => (def.tools ? [[def.id, widgetToolsOf(def)]] : []))), [definitions]);
  const toolsOf = useCallback((id: string): ReactNode => tools[id], [tools]);
  return { content, settingsContent, toolsOf };
};

export { useWidgetContent };
