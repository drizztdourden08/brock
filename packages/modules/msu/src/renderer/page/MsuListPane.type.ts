/* @layer renderer-shell @kind types */
import type { MsuManagerModel } from '../studio/msu-manager.type';
import type { MsuOriginState } from './msu-origin.type';

interface MsuListPaneProps {
  section: 'create' | 'import' | 'packs';
  msu: MsuManagerModel;
  origin: MsuOriginState;
}

export type { MsuListPaneProps };
