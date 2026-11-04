/* @layer core @kind logic */
import type { NoticePart } from './notice.type';

const itemPart = (text: string): NoticePart => ({ text, tone: 'item' });

export { itemPart };
