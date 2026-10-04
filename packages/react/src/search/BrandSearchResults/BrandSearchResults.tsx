/* @layer renderer-shell @kind component */
import { ChosenMascot } from '@drizztdourden08/tessera/brand';
import { SearchResults } from '@drizztdourden08/tessera/composites';
import type { SearchResultsProps } from '@drizztdourden08/tessera/composites';
import { Box, Span, useTesseraStrings } from '@drizztdourden08/tessera/primitives';
import { useBrandMascot } from '../../brand/useBrandMascot';
import { EMPTY_CLIP, IDLE_CLIP } from './BrandSearchResults.constants';
import './BrandSearchResults.css';

const BrandSearchResults = (props: SearchResultsProps) => {
  const { emptyMessage } = props;
  const mascot = useBrandMascot();
  const { navigation } = useTesseraStrings();
  if (!mascot) return <SearchResults {...props} />;

  const idleIcon = <ChosenMascot mascot={mascot} animation={IDLE_CLIP} size="lg" />;
  const empty = (
    <Box className="brand-search-results__empty">
      <ChosenMascot mascot={mascot} animation={EMPTY_CLIP} size="lg" />
      <Span>{emptyMessage ?? navigation.searchTip}</Span>
    </Box>
  );
  return <SearchResults {...props} idleIcon={idleIcon} emptyMessage={empty} />;
};

export { BrandSearchResults };
