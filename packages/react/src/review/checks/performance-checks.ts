/* @layer renderer-shell @kind logic */
import { FPS_VALUE, PERFORMANCE_GAUGES, PERFORMANCE_PROCESSES, PERFORMANCE_TILES } from '../review.constants';
import type { PerformanceSnapshot, ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const changedTiles = (snapshot: PerformanceSnapshot): string[] =>
  Object.keys(snapshot.after.tiles).filter((label) => snapshot.before.tiles[label] !== undefined && snapshot.before.tiles[label] !== snapshot.after.tiles[label]);

const performanceChecks = (snapshot: PerformanceSnapshot): ReviewOutcome[] => {
  const { before, after } = snapshot;
  const tileLabels: readonly string[] = Object.values(PERFORMANCE_TILES);
  const fps = after.tiles[PERFORMANCE_TILES.frameRate] ?? '(no tile)';
  const missingTiles = tileLabels.filter((label) => after.tiles[label] === undefined);
  const drawn = after.sparklines.filter((line) => line !== '');
  const missingGauges = PERFORMANCE_GAUGES.filter((label) => !after.gauges.includes(label));
  const missingParts = PERFORMANCE_PROCESSES.filter((label) => !after.legend.includes(label));
  const movedLines = after.sparklines.filter((line, index) => before.sparklines[index] !== undefined && before.sparklines[index] !== line).length;
  const changed = changedTiles(snapshot);
  return [
    outcome('performance-sampling', snapshot.sampling, 'the performance widget is sampling while shown', 'the performance widget shows "Paused" while it is on screen'),
    outcome('performance-tiles', missingTiles.length === 0, `the widget shows the ${tileLabels.join(', ')} tiles`, `the widget has no ${missingTiles.join(', ')} tile`),
    outcome('performance-frame-rate', FPS_VALUE.test(fps), `the frame rate tile reads ${fps} fps`, `the frame rate tile reads "${fps}", expected a whole number`),
    outcome('performance-sparklines', drawn.length >= tileLabels.length, `${drawn.length} sparklines draw the recent samples`, `${drawn.length} of ${after.sparklines.length} sparklines have a line, expected ${tileLabels.length}`),
    outcome('performance-gauges', missingGauges.length === 0, `the gauges show ${after.gauges.join(', ')}`, `the gauges show ${after.gauges.join(', ') || 'nothing'}, missing ${missingGauges.join(', ')}`),
    outcome(
      'performance-memory-bar',
      after.segments >= PERFORMANCE_PROCESSES.length && missingParts.length === 0,
      `memory by process splits into ${after.segments} parts (${after.legend.join(', ')})`,
      `memory by process shows ${after.segments} parts (${after.legend.join(', ') || 'none'}), missing ${missingParts.join(', ')}`,
    ),
    outcome(
      'performance-live',
      movedLines > 0 && changed.length > 0,
      `${movedLines} sparklines moved and the tiles changed between two reads (${changed.join(', ')})`,
      `between two reads ${movedLines} sparklines moved and ${changed.length} tiles changed; the widget is not refreshing`,
    ),
    outcome(
      'performance-body-scrolls',
      snapshot.inBody && !after.ownScroll,
      'the widget body scrolls the panel; the panel adds no scroll box of its own',
      snapshot.inBody ? 'the panel wraps itself in its own scroll box inside the widget body' : 'the panel is not inside a widget body',
    ),
  ];
};

export { performanceChecks };
