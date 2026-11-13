/* @layer renderer-components @kind component */
import { EmptyState } from '@drizztdourden08/tessera/primitives';
import { DeviceRow } from './DeviceRow';
import type { DevicesBodyProps } from './DevicesBody.type';

const DevicesBody = ({ entries, labels, onAssign, onAddMapping }: DevicesBodyProps) => (
  <>
    {entries.map((entry) => (
      <DeviceRow key={entry.key} entry={entry} onAssign={onAssign} onAddMapping={onAddMapping} />
    ))}
    {entries.length === 0 && <EmptyState message={labels.noDevices} />}
  </>
);

export { DevicesBody };
