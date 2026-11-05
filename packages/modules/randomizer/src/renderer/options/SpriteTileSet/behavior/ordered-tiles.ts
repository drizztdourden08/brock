/* @layer renderer-shell @kind logic */
import type { SpriteTileItem } from '../SpriteTileSet.type';

const orderedTiles = (items: readonly SpriteTileItem[], order?: readonly string[]): readonly SpriteTileItem[] => {
  if (order === undefined) return items;
  const rankOf = (item: SpriteTileItem): number => {
    const at = order.indexOf(item.id);
    return at === -1 ? order.length : at;
  };
  return [...items].sort((a, b) => rankOf(a) - rankOf(b));
};

export { orderedTiles };
