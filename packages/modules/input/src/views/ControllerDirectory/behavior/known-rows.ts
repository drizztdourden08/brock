/* @layer renderer-shell @kind logic */
import type { DeviceEntry } from '../../../device.type';
import type { MappingEntry } from '../../../mapping/mapping-entry.type';
import type { DirectoryRow } from '../ControllerDirectory.type';
import { mappingOf } from './mapping-of';
import { vidPidKey } from './vid-pid-key';

const knownRows = (mappings: readonly MappingEntry[], devices: readonly DeviceEntry[]): DirectoryRow[] => {
  const taken = new Set(devices.map((device) => mappingOf(device, mappings)).filter((entry) => entry !== undefined));
  return mappings
    .filter((entry) => !taken.has(entry))
    .map((entry) => ({
      id: `${entry.guid}:${entry.platform ?? ''}`,
      name: entry.name,
      vidPid: vidPidKey(entry.vid, entry.pid),
      family: entry.family ?? 'generic',
      source: entry.source,
      inputs: entry.inputCount,
      group: 'Known',
      connectedKey: null,
    }));
};

export { knownRows };
