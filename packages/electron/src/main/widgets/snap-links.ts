/* @layer electron-main @kind logic */
import { liveEntries } from './live-entries';

const pairs = (): string[][] =>
  liveEntries().filter(([, entry]) => !entry.closing).flatMap(([own, entry]) => (entry.link ? [[own, entry.link.to]] : []));

const around = (links: readonly string[][], at: string): string[] => links.filter((pair) => pair.includes(at)).flat();

const snapLinks = { pairs, around };

export { snapLinks };
