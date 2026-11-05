/* @layer renderer-shell @kind logic */
import type { MsuStudioGame } from '../../game/msu-studio-game.type';
import type { RoleInfo } from './role-info.type';

const roleInfo = (game: MsuStudioGame<never, never>, role: string): RoleInfo => {
  const tab = game.soundTabs.find((entry) => entry.roles?.labels[role] !== undefined);
  return { label: tab?.roles?.labels[role] ?? role, hint: tab?.roles?.hints[role] };
};

export { roleInfo };
