/* @layer core @kind logic */
import type { MissingEvent } from './i18n.type';

const createReporter = (onMissing: ((event: MissingEvent) => void) | undefined): ((event: MissingEvent) => void) => {
  const seen = new Set<string>();
  return (event) => {
    if (!onMissing) return;
    const id = `${event.kind}|${event.key}|${event.locale}`;
    if (seen.has(id)) return;
    seen.add(id);
    onMissing(event);
  };
};

export { createReporter };
