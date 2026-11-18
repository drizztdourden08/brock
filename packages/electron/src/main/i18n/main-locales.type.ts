/* @layer electron-main @kind types */
import type { Layer } from '@drizztdourden08/brock-core/i18n';

type MainLocales = {
  readonly base: string;
  readonly layers: readonly Layer[];
  readonly loaders: Readonly<Record<string, () => Promise<readonly Layer[]>>>;
};

export type { MainLocales };
