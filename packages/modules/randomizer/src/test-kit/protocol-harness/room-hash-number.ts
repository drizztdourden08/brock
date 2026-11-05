/* @layer core @kind logic */
import { roomHashOf as roomHashText } from '../../archipelago';

const roomHashOf = (seedName: string): number => Number(roomHashText(seedName));

export { roomHashOf };
