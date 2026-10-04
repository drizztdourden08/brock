/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';
import type { PerformanceReading } from '../review.type';

const textsOf = (root: ParentNode, selector: string): string[] => [...root.querySelectorAll(selector)].map((node) => node.textContent.trim());

const readPerformance = (root: HTMLElement): PerformanceReading => ({
  tiles: Object.fromEntries([...root.querySelectorAll(SELECTORS.statTile)].map((tile) => [
    tile.querySelector(SELECTORS.statTileLabel)?.textContent.trim() ?? '',
    tile.querySelector(SELECTORS.statTileValue)?.textContent.trim() ?? '',
  ])),
  sparklines: [...root.querySelectorAll(SELECTORS.sparklineLine)].map((line) => line.getAttribute('d') ?? ''),
  gauges: textsOf(root, SELECTORS.gaugeLabel),
  segments: root.querySelectorAll(SELECTORS.barSegment).length,
  legend: textsOf(root, SELECTORS.barName),
  ownScroll: root.querySelector(SELECTORS.scrollArea) !== null,
});

export { readPerformance };
