/* @layer renderer-shell @kind hook */
import { useDeveloperTools } from '../app/useDeveloperTools';
import { useMenuHiddenStore } from '../menu/useMenuHiddenStore';
import { useShowContext } from '../screens/show/useShowContext';
import { useProfilesStore } from '../stores/useProfilesStore';
import { commandGroups } from './command-groups';
import type { CommandGroupsView } from './command.type';
import { listCommands } from './list-commands';
import { useCommandState } from './useCommandState';

const useCommandGroups = (): CommandGroupsView => {
  const state = useCommandState();
  useDeveloperTools();
  useProfilesStore((s) => s.active !== null);
  useShowContext();
  useMenuHiddenStore((s) => s.routes);
  return { groups: commandGroups(listCommands(state)), state };
};

export { useCommandGroups };
