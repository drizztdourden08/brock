/* @layer renderer-shell @kind logic */
import type { HubDef } from '../../hub.type';
import type { HubLiveEntry } from '../Hub.type';

const liveEntriesOf = (def: HubDef): HubLiveEntry[] =>
  def.groups.flatMap((group) => group.pages.flatMap((page) => (page.live === undefined ? [] : [{ id: page.id, source: page.live }])));

export { liveEntriesOf };
