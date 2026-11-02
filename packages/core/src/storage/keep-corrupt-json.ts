/* @layer core @kind logic */
import type { FileStore } from '../platform/ports/file-store.type';

const keepCorruptJson = async (files: FileStore, path: string, text: string, reason: string): Promise<void> => {
  const copy = `${path}.corrupt-${Date.now()}`;
  console.error(`[json-store] ${path} does not parse (${reason}); kept a copy at ${copy} and using the fallback`);
  try {
    await files.writeText(copy, text);
    await files.remove(path);
  } catch (error) {
    console.error(`[json-store] could not move ${path} aside: ${String(error)}`);
  }
};

export { keepCorruptJson };
