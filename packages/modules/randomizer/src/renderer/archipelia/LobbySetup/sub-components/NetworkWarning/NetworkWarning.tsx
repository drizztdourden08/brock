/* @layer renderer-shell @kind component */
import { Button, Callout } from '@drizztdourden08/tessera/primitives';
import { ALLOW_LABEL, NETWORK_BLOCKED } from './NetworkWarning.constants';
import type { NetworkWarningProps } from './NetworkWarning.type';

const NetworkWarning = ({ onAllow }: NetworkWarningProps) => (
  <Callout
    tone="warning"
    variant="footnote"
    action={<Button size="sm" variant="secondary" onClick={onAllow}>{ALLOW_LABEL}</Button>}
  >
    {NETWORK_BLOCKED}
  </Callout>
);

export { NetworkWarning };
