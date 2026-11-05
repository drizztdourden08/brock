/* @layer renderer-shell @kind logic */
import { createContext } from 'react';
import type { MsuStudioGame } from './msu-studio-game.type';

const MsuStudioContext = createContext<MsuStudioGame | null>(null);

export { MsuStudioContext };
