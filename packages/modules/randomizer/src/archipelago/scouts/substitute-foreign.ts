/* @layer core @kind logic */
import type { ApNetworkItem } from '../protocol/protocol.type';
import type { ScoutPlacement } from './scout-placement.type';

const substituteForeign = (scouts: readonly ApNetworkItem[], slot: number): ScoutPlacement[] =>
  scouts.map((scout) => ({ location: scout.location, item: scout.player === slot ? scout.item : null }));

export { substituteForeign };
