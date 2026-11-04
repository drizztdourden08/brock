/* @layer renderer-shell @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import type { InfoValue } from '../../../provider/block.type';
import { idLabel } from './id-label';

interface IdValueProps {
  value: InfoValue;
  hexIds: boolean;
}

const IdValue = ({ value, hexIds }: IdValueProps) => (
  <Text mono={typeof value === 'object'}>{typeof value === 'object' ? idLabel(value, hexIds) : value}</Text>
);

export { IdValue };
