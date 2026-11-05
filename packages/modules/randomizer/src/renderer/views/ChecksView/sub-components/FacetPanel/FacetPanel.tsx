/* @layer renderer-shell @kind component */
import { Card, SegmentedControl, TagPicker } from '@drizztdourden08/tessera/primitives';
import { facetGroups } from '../../behavior/facet-groups';
import { FACET_MODE_OPTIONS } from '../../ChecksView.constants';
import type { FacetPanelProps } from './FacetPanel.type';

const FacetPanel = ({ provider, prefs }: FacetPanelProps) => {
  const [facets, setFacets] = prefs.facets;
  const [facetMode, setFacetMode] = prefs.facetMode;
  return (
    <Card>
      <SegmentedControl size="sm" value={facetMode} options={FACET_MODE_OPTIONS} onChange={setFacetMode} />
      <TagPicker value={[...facets]} groups={facetGroups(provider)} onChange={setFacets} />
    </Card>
  );
};

export { FacetPanel };
