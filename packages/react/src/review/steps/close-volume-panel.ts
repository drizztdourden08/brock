/* @layer renderer-shell @kind logic */
import { find } from '../dom/find';
import { settle } from '../dom/settle';
import { unhover } from '../dom/unhover';
import { waitFor } from '../dom/wait-for';
import { volumePanelOpen } from './volume-panel-open';
import { VOLUME_SELECTORS } from './volume-step.constants';

const closeVolumePanel = async (item: HTMLElement): Promise<void> => {
  unhover(item);
  const active = document.activeElement;
  if (active instanceof HTMLElement && (item.contains(active) || find(VOLUME_SELECTORS.panel)?.contains(active) === true)) active.blur();
  await waitFor(() => !volumePanelOpen());
  await settle();
};

export { closeVolumePanel };
