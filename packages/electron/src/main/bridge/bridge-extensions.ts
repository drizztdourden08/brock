/* @layer electron-main @kind logic */
import type { BridgeExtension, BridgeExtensions } from './bridge-extension.type';

const createBridgeExtensions = (): BridgeExtensions => {
  const added = new Map<string, BridgeExtension>();
  return {
    add: (extension) => {
      if (added.has(extension.id)) throw new Error(`bridge extension "${extension.id}" is already added`);
      added.set(extension.id, extension);
      return () => {
        if (added.get(extension.id) === extension) added.delete(extension.id);
      };
    },
    list: () => [...added.values()],
    asksForBoot: () => [...added.values()].some((extension) => extension.openOnBoot === true),
  };
};

export { createBridgeExtensions };
