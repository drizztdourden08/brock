/* @layer renderer-shell @kind logic */
import { SCREENS_GROUP } from '../../../commands/commands.constants';
import type { CommandDef } from '../../../commands/command.type';
import { openCommandId } from '../../../commands/open-command-id';
import { useMenuHiddenStore } from '../../../menu/useMenuHiddenStore';
import { nav } from '../../../navigation/nav';
import { resolveRoute } from '../../../navigation/resolve-route';
import { routeAliases } from '../../../navigation/route-aliases';
import { routeHidden } from '../../../screens/show/route-hidden';
import { routeHiddenNow } from '../../../screens/show/route-hidden-now';
import type { RouteCommandsInput } from '../BrockApp.type';

const menuHides = (route: string): boolean => routeHidden(route, useMenuHiddenStore.getState().routes);

const opener = (route: string, label: string, chord: string, when: () => boolean): CommandDef => ({
  id: openCommandId(route), label, group: SCREENS_GROUP, chord, when: () => when() && !menuHides(route), run: () => nav.toggle(route),
});

const routeCommands = ({ registry, shortcuts, allowed, labelOf }: RouteCommandsInput): CommandDef[] => [
  ...registry.list().flatMap((screen) => (screen.shortcut === undefined ? [] : [opener(screen.id, screen.title, screen.shortcut, () => allowed(screen))])),
  ...shortcuts.map((entry) => opener(entry.target, labelOf(entry.target), entry.shortcut, () =>
    allowed(registry.get(resolveRoute(entry.target, {}, routeAliases.get).active)) && !routeHiddenNow(entry.target, registry))),
];

export { routeCommands };
