/* @layer renderer-shell @kind component */
import { memo, useMemo } from 'react';
import { StatTile } from '@drizztdourden08/tessera/composites';
import { Box, Sparkline } from '@drizztdourden08/tessera/primitives';
import { REVIEW_MASK } from '@drizztdourden08/brock-core/review';
import { tileSpecs } from '../behavior/tile-specs';
import type { PerformanceTilesProps } from '../PerformanceWidget.type';

const PerformanceTilesView = (props: PerformanceTilesProps) => {
  const { renderer, processes, shown } = props;
  const tiles = useMemo(() => tileSpecs(renderer, processes, shown), [renderer, processes, shown]);

  return (
    <Box className="performance-widget__tiles" {...REVIEW_MASK}>
      {tiles.map((tile) => (
        <StatTile
          key={tile.id}
          className="performance-widget__tile"
          label={tile.label}
          value={tile.value}
          unit={tile.unit}
          tone={tile.tone}
          delta={tile.change.text}
          trend={tile.change.trend}
          upIs={tile.upIs}
          chart={<Sparkline {...tile.chart} />}
        />
      ))}
    </Box>
  );
};

const PerformanceTiles = memo(PerformanceTilesView);

export { PerformanceTiles };
