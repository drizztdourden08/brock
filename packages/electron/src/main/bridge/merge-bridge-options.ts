/* @layer electron-main @kind logic */
import type { AppBridgeOptions } from './app-bridge.type';
import type { BridgeExtension } from './bridge-extension.type';

const largest = (values: (number | undefined)[]): number | undefined => {
  const given = values.filter((value): value is number => value !== undefined);
  return given.length === 0 ? undefined : Math.max(...given);
};

const mergeBridgeOptions = (base: AppBridgeOptions | null, extensions: readonly BridgeExtension[]): AppBridgeOptions | null => {
  if (!base && extensions.length === 0) return null;
  const parties = [...(base ? [base] : []), ...extensions];
  return {
    ...base,
    register: async (bridge, ctx) => {
      for (const party of parties) await party.register(bridge, ctx);
    },
    maxMessageBytes: largest(parties.map((party) => party.maxMessageBytes)),
    maxBufferedBytes: largest(parties.map((party) => party.maxBufferedBytes)),
  };
};

export { mergeBridgeOptions };
