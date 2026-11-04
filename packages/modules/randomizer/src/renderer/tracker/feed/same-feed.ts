/* @layer renderer-shell @kind logic */
import { sameList } from './same-list';
import { sameMembers } from './same-members';
import type { TrackerFeedInput } from './tracker-feed-state.type';

const sameFeed = (a: TrackerFeedInput | null, b: TrackerFeedInput | null): boolean => {
  if (a === null || b === null) return a === b;
  return a.placement === b.placement && sameMembers(a.checked, b.checked) && sameMembers(a.completed, b.completed) && sameList(a.held, b.held);
};

export { sameFeed };
