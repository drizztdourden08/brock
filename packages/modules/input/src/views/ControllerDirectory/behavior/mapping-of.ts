/* @layer renderer-shell @kind logic */
import type { DeviceEntry } from '../../../device.type';
import type { MappingEntry } from '../../../mapping/mapping-entry.type';

const mappingOf = (device: DeviceEntry, mappings: readonly MappingEntry[]): MappingEntry | undefined =>
  mappings.find((entry) => device.guid !== undefined && entry.guid === device.guid)
  ?? mappings.find((entry) => entry.vid === device.vendorId && entry.pid === device.productId);

export { mappingOf };
