/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { useHubContextStore } from '../../../useHubContextStore';
import type { HubHeaderProps } from './HubHeader.type';
import './HubHeader.css';

const HubHeader = (props: HubHeaderProps) => {
  const { hub } = props;
  const context = useHubContextStore((s) => s.byHub[hub.id]);
  const header = hub.header;
  if (header === undefined || context === undefined) return null;
  const actions = header.actions?.(context);
  return (
    <Box className="hub-header">
      <Box className="hub-header__main">{header.render(context)}</Box>
      {actions != null && <Box className="hub-header__actions">{actions}</Box>}
    </Box>
  );
};

export { HubHeader };
