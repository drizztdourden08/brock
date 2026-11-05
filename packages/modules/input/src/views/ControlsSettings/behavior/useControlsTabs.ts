/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import type { ControlsTabDef, UseControlsTabsArgs } from '../ControlsSettings.type';

const firstEnabled = (tabs: readonly ControlsTabDef[]): ControlsTabDef | undefined =>
  tabs.find((tab) => !tab.disabledReason);

const useControlsTabs = ({ tabs, initialTab }: UseControlsTabsArgs) => {
  const [activeId, setActiveId] = useState(() => initialTab ?? firstEnabled(tabs)?.id ?? '');

  useEffect(() => {
    const current = tabs.find((tab) => tab.id === activeId);
    if (current && !current.disabledReason) return;
    const fallback = firstEnabled(tabs);
    if (fallback && fallback.id !== activeId) setActiveId(fallback.id);
  }, [tabs, activeId]);

  const activeTab = tabs.find((tab) => tab.id === activeId) ?? null;
  return { activeId, activeTab, setActiveTab: setActiveId };
};

export { useControlsTabs };
