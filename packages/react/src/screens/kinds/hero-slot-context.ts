/* @layer renderer-shell @kind logic */
import { createContext } from 'react';
import type { PutHeroSlot } from './screen-kinds.type';

const HeroSlotContext = createContext<PutHeroSlot>(() => undefined);

export { HeroSlotContext };
