/* @layer core @kind logic */
import type { NoticePart } from './notice.type';

const playerPart = (text: string): NoticePart => ({ text, tone: 'player' });

export { playerPart };
