/* @layer core @kind logic */
import { roomHashOf as roomHashText } from '../../archipelago';

const ROOM_MISMATCH = '[Online] This save belongs to another Archipelago room';

const roomHashOf = (seedName: string): number => Number(roomHashText(seedName));

export { ROOM_MISMATCH, roomHashOf };
