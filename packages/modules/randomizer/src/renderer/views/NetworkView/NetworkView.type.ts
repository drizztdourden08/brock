/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { StatusMap } from '@drizztdourden08/tessera/primitives';
import type { ConnectionState, NetworkStatus } from '../../../archipelago';

interface NetworkSectionProps {
  status: NetworkStatus;
}

type ConnectionStatusDef = Omit<StatusMap<ConnectionState>[ConnectionState], 'label'> & { label: Text };

export type { ConnectionStatusDef, NetworkSectionProps };
