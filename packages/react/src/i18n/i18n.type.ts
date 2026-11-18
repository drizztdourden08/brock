/* @layer renderer-shell @kind types */
import type { Direction, I18n, Layer, Text } from '@drizztdourden08/brock-core/i18n';

type AppLocales = {
  readonly base: string;
  readonly layers: readonly Layer[];
  readonly tags: readonly string[];
  readonly load: (tag: string) => Promise<readonly Layer[]>;
};

type I18nValue = { readonly i18n: I18n; readonly locale: string };

type LocaleView = {
  readonly locale: string;
  readonly dir: Direction;
  readonly chain: readonly string[];
  readonly format: I18n['format'];
  readonly setLocale: (tag: string) => Promise<void>;
};

type TextOf = (value: Text) => string;

export type { AppLocales, I18nValue, LocaleView, TextOf };
