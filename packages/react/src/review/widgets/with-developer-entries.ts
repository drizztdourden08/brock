/* @layer renderer-shell @kind logic */
import { createElement, Fragment } from 'react';
import { defineWidget } from '../../widgets/define-widget';
import { defineWidgetKit } from '../../widgets/kits/define-widget-kit';
import { registerWidgetKits } from '../../widgets/kits/register-widget-kits';
import { useWidgetKitStore } from '../../widgets/kits/useWidgetKitStore';
import { registerWidgets } from '../../widgets/register-widgets';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { soon } from './soon';
import { DEV_MENU_KIT, DEV_MENU_MEMBER, DEV_MENU_WIDGET } from './kit-review.constants';

const blank = () => createElement(Fragment);

const registered = (): boolean => {
  const kits = useWidgetKitStore.getState();
  return useWidgetLayoutStore.getState().definitions.some((def) => def.id === DEV_MENU_WIDGET.id)
    && kits.kits.some((kit) => kit.id === DEV_MENU_KIT.id) && kits.members.some((def) => def.id === DEV_MENU_MEMBER.id);
};

const withDeveloperEntries = async (run: () => Promise<void>): Promise<void> => {
  const removeWidgets = registerWidgets([
    defineWidget({ ...DEV_MENU_WIDGET, devOnly: true, render: blank }),
    defineWidget({ ...DEV_MENU_MEMBER, kit: DEV_MENU_KIT.id, render: blank }),
  ]);
  const removeKit = registerWidgetKits([defineWidgetKit({ ...DEV_MENU_KIT, devOnly: true })]);
  try {
    await soon(registered);
    await run();
  } finally {
    removeKit();
    removeWidgets();
  }
};

export { withDeveloperEntries };
