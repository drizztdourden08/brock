/* @layer renderer-shell @kind logic */
import { escapeLayers } from '../../../escape/escape-layers';
import { resolveEscape } from '../../../escape/resolve-escape';
import { nav } from '../../../navigation/nav';
import { useNavigationStore } from '../../../navigation/useNavigationStore';
import { useDialogStore } from '../../../stores/useDialogStore';

const closeTopmost = (e: KeyboardEvent, homeScreen: string | null): void => {
  const layer = escapeLayers.topmost();
  const dialog = useDialogStore.getState();
  const action = resolveEscape({
    layerOpen: layer !== null,
    dialogOpen: dialog.dialog !== null,
    screenOpen: useNavigationStore.getState().active !== null,
    homeAvailable: homeScreen !== null,
  });
  if (action === 'none') return;
  e.preventDefault();
  if (action === 'layer') layer?.close();
  else if (action === 'dialog') dialog.dismiss();
  else if (action === 'screen') nav.escape();
  else if (homeScreen !== null) nav.home(homeScreen);
};

export { closeTopmost };
