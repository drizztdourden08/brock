/* @layer renderer-shell @kind logic */
import type { HubNavMode } from '../../../screens/conventions/screens-config.type';

const railNav = (mode: HubNavMode | undefined): { variant?: 'rail'; collapsed?: boolean } =>
  (mode === 'rail' ? { variant: 'rail', collapsed: true } : {});

export { railNav };
