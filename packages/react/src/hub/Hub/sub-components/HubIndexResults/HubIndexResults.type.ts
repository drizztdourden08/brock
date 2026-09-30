/* @layer renderer-shell @kind types */
import type { SearchEntry } from '../../../../search/search.type';
import type { HubDef, HubPage } from '../../../hub.type';

interface HubIndexResultsProps {
  def: HubDef;
  pages: readonly HubPage[];
  query: string;
  onOpen: (entry: SearchEntry) => void;
  onOpenPage: (id: string) => void;
}

export type { HubIndexResultsProps };
