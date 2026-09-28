/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { HeaderTabs } from '@drizztdourden08/tessera/composites';
import { NO_TABS } from '../../../hub.constants';
import { useHubState } from '../../behavior/useHubState';
import type { HubHeaderTabsProps } from './HubHeaderTabs.type';

const HubHeaderTabs = (props: HubHeaderTabsProps) => {
  const { def, ctx } = props;
  const { page, tab, selectTab } = useHubState(def, ctx);
  const tabs = page.tabs ?? NO_TABS;
  const items = useMemo(() => tabs.map((entry) => ({ id: entry.id, label: entry.label })), [tabs]);
  if (items.length === 0) return null;
  return <HeaderTabs items={items} activeId={tab?.id ?? ''} onSelect={selectTab} ariaLabel={`${page.label} tabs`} />;
};

export { HubHeaderTabs };
