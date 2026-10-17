/* @layer renderer-shell @kind logic */
import { find } from '../dom/find';
import { VOLUME_SELECTORS } from './volume-step.constants';

const volumePanelOpen = (): boolean => find(VOLUME_SELECTORS.panel) !== null;

export { volumePanelOpen };
