/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import type { HubPagePaneProps } from './HubPagePane.type';

const HubPagePane = (props: HubPagePaneProps) => {
  const { page, tab, context } = props;
  return <Box className="hub-screen__page">{tab ? tab.render(context) : page.render(context)}</Box>;
};

export { HubPagePane };
