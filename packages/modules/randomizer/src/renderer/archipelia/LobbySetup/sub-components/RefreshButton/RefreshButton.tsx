/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Button, Icon } from '@drizztdourden08/tessera/primitives';
import { REFRESH_LABEL } from './RefreshButton.constants';
import type { RefreshButtonProps } from './RefreshButton.type';

const RefreshButton = ({ access, disabled }: RefreshButtonProps) => {
  const text = useText();
  return (
    <Button
      size="sm"
      variant="ghost"
      icon={<Icon name="refresh-cw" />}
      loading={access.refreshing}
      disabled={disabled}
      onClick={access.onRefresh}
    >
      {text(REFRESH_LABEL)}
    </Button>
  );
};

export { RefreshButton };
