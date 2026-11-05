/* @layer renderer-shell @kind types */
import type { PatternValue } from '@drizztdourden08/tessera/composites';

interface RemoteAddressProps {
  value: PatternValue;
  onChange: (next: PatternValue) => void;
  disabled: boolean;
}

export type { RemoteAddressProps };
