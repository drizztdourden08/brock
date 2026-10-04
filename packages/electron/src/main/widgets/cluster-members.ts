/* @layer electron-main @kind logic */
import { clusterOf } from './cluster-of';
import { memberOf } from './member-of';
import { MAIN_ANCHOR } from './widget-windows.constants';
import type { ClusterMember } from './widget-windows.type';

const rank = (member: ClusterMember): number => (member.entry === null ? -Infinity : member.entry.zStamp);

const clusterMembers = (id: string): ClusterMember[] =>
  clusterOf(id)
    .map(memberOf)
    .filter((member): member is ClusterMember => member !== null && (member.id === MAIN_ANCHOR || member.entry?.closing === null))
    .sort((a, b) => rank(a) - rank(b));

export { clusterMembers };
