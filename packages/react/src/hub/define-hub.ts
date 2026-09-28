/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import { defineScreen } from '../screens/define-screen';
import type { ScreenDef } from '../screens/screen.type';
import { Hub } from './Hub';
import { HubHeaderTabs } from './Hub/sub-components/HubHeaderTabs';
import { HubSwitch } from './Hub/sub-components/HubSwitch';
import { HUB_DEFS } from './hub.constants';
import type { HubDef } from './hub.type';

const defineHub = (def: HubDef): ScreenDef => {
  const screen = defineScreen({
    id: def.id,
    title: def.title,
    icon: def.icon,
    shortcut: def.shortcut,
    subtitle: (ctx) => ctx.profile?.name,
    extra: (ctx) => createElement(HubHeaderTabs, { def, ctx }),
    floating: (ctx) => createElement(HubSwitch, { current: def.id, onSelect: (id: string) => ctx.open(id) }),
    render: (ctx) => createElement(Hub, { def, ctx }),
  });
  HUB_DEFS.set(screen, def);
  return screen;
};

export { defineHub };
