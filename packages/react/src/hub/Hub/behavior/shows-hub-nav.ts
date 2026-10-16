/* @layer renderer-shell @kind logic */
import type { HubNavMode } from '../../../screens/conventions/screens-config.type';

const showsHubNav = (mode: HubNavMode | undefined, visiblePages: number): boolean =>
  mode === 'always' || (mode !== false && visiblePages > 1);

export { showsHubNav };
