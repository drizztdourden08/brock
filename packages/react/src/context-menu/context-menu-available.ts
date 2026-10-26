/* @layer renderer-shell @kind logic */
import { nativeHeld } from './native-held';
import { zonesAt } from './zones-at';

const contextMenuAvailable = (target: EventTarget | null): boolean => zonesAt(target).length > 0 && !nativeHeld(target);

export { contextMenuAvailable };
