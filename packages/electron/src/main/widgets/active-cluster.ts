/* @layer electron-main @kind logic */
import { clusterMembers } from './cluster-members';

const activeCluster = (id: string): boolean => clusterMembers(id).length > 1;

export { activeCluster };
