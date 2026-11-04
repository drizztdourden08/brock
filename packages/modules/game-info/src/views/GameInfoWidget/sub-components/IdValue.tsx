/* @layer renderer-shell @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import { idLabel } from '../behavior/id-label';
import type { IdValueProps } from './IdValue.type';

const IdValue = ({ value, hexIds }: IdValueProps) => (
  <Text mono={typeof value === 'object'}>{typeof value === 'object' ? idLabel(value, hexIds) : value}</Text>
);

export { IdValue };
