/* @layer core @kind logic */
import { canFillLocation } from './can-fill-location';
import type { CollectionState, FillRestrictiveInput, KeysOf, World } from '../types';

const makeFits = <W extends World>(allowedAt: FillRestrictiveInput<W>['allowedAt']) => (
  state: CollectionState<W>,
  item: KeysOf<W>['item'],
  location: KeysOf<W>['location'],
  checkAccess: boolean,
): boolean =>
    (allowedAt === undefined || allowedAt(item, location))
    && canFillLocation(state, location, item, checkAccess);

export { makeFits };
