/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { wireList } from '../network/wire-list';

const markRoomChecked = (
  ctx: OnlineContext,
  checked: readonly number[] | undefined,
  missing?: readonly number[],
): void => {
  const { room, host } = ctx;
  const fresh = wireList(checked).filter((id) => !room.checked.has(id));
  for (const id of fresh) {
    room.checked.add(id);
    room.missing.delete(id);
  }
  for (const id of wireList(missing)) if (!room.checked.has(id)) room.missing.add(id);
  if (fresh.length > 0) host.markCollected(fresh);
};

export { markRoomChecked };
