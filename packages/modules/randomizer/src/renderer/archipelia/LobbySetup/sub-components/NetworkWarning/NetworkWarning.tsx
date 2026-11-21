/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Button, Callout } from '@drizztdourden08/tessera/primitives';
import { ALLOW_LABEL, NETWORK_BLOCKED } from './NetworkWarning.constants';
import type { NetworkWarningProps } from './NetworkWarning.type';

const NetworkWarning = ({ onAllow }: NetworkWarningProps) => {
  const text = useText();
  return (
    <Callout
      tone="warning"
      variant="footnote"
      action={<Button size="sm" variant="secondary" onClick={onAllow}>{text(ALLOW_LABEL)}</Button>}
    >
      {text(NETWORK_BLOCKED)}
    </Callout>
  );
};

export { NetworkWarning };
