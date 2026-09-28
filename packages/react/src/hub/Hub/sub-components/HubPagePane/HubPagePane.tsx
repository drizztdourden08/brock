/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { HeaderTabs, WindowHeader } from '@drizztdourden08/tessera/composites';
import { NO_TABS } from '../../../hub.constants';
import type { HubPagePaneProps } from './HubPagePane.type';

const HubPagePane = (props: HubPagePaneProps) => {
  const { page, tab, context, onSelectTab } = props;
  const tabs = page.tabs ?? NO_TABS;
  const items = useMemo(() => tabs.map((entry) => ({ id: entry.id, label: entry.label })), [tabs]);
  const title = (
    <Box as="span" className="hub-screen__title">
      {page.icon && <Box as="span" className="hub-screen__page-icon" aria-hidden="true">{page.icon}</Box>}
      {page.label}
    </Box>
  );
  const strip = items.length > 0
    ? <HeaderTabs items={items} activeId={tab?.id ?? ''} onSelect={onSelectTab} ariaLabel={`${page.label} tabs`} />
    : undefined;

  return (
    <Box className="hub-screen__pane">
      <WindowHeader className="hub-screen__header" title={title} subtitle={context.hub.title} extra={strip} onClose={context.close} />
      <Box className="hub-screen__page">{tab ? tab.render(context) : page.render(context)}</Box>
    </Box>
  );
};

export { HubPagePane };
