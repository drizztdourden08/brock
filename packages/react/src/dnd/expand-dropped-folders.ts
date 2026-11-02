/* @layer renderer-shell @kind logic */
import type { DocumentEntry } from '@drizztdourden08/brock-core';
import { getPlatform } from '../platform/get-platform';
import type { DroppedPath, PathDropExpand, RejectedFile } from './path-drop.type';

interface Expanded {
  entries: DocumentEntry[];
  rejected: RejectedFile[];
  truncated: boolean;
}

const expandDroppedFolders = async (folders: readonly DroppedPath[], expand: PathDropExpand): Promise<Expanded> => {
  const result: Expanded = { entries: [], rejected: [], truncated: false };
  const documents = getPlatform().documents;
  const options = { recursive: expand.recursive === true, extensions: expand.extensions ? [...expand.extensions] : undefined };
  for (const folder of folders) {
    try {
      const listing = await documents?.list(folder.path, options);
      if (!listing) continue;
      result.entries.push(...listing.entries);
      result.truncated ||= listing.truncated;
    } catch {
      result.rejected.push({ name: folder.name, reason: 'The folder could not be listed' });
    }
  }
  return result;
};

export { expandDroppedFolders };
