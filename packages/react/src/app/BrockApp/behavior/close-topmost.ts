/* @layer renderer-shell @kind logic */
import { escapeLayers } from '../../../escape/escape-layers';
import { resolveEscape } from '../../../escape/resolve-escape';
import type { EscapeAction } from '../../../escape/escape.type';
import { nav } from '../../../navigation/nav';
import { useNavigationStore } from '../../../navigation/useNavigationStore';
import { useDialogStore } from '../../../stores/useDialogStore';
import type { EscapeContext } from '../BrockApp.type';

const run = (action: EscapeAction, context: EscapeContext, homeScreen: string | null): void => {
  if (action === 'layer') escapeLayers.topmost()?.close();
  else if (action === 'dialog') useDialogStore.getState().dismiss();
  else if (action === 'screen' && context.holds?.() !== true) nav.close();
  else if (action === 'reopen') nav.reopen();
  else if (action === 'home' && homeScreen !== null) nav.home(homeScreen);
};

const closeTopmost = (e: KeyboardEvent, context: EscapeContext): void => {
  const homeScreen = context.home();
  const action = resolveEscape({
    layerOpen: escapeLayers.topmost() !== null,
    dialogOpen: useDialogStore.getState().dialog !== null,
    screenOpen: useNavigationStore.getState().active !== null,
    reopenAvailable: context.reopenable?.() === true,
    homeAvailable: homeScreen !== null,
  });
  if (action === 'none') return;
  e.preventDefault();
  run(action, context, homeScreen);
};

export { closeTopmost };
