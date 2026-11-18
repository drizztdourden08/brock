/* @layer core @kind types */
import type { Layer } from './catalog/catalog.type';
import type { Direction } from './locale/locale.type';
import type { ArgsOf, MessageKey, ValuesOf } from './message-key.type';
import type { Text } from './text.type';

type MissingEvent = {
  readonly kind: 'fallback' | 'missing';
  readonly key: string;
  readonly locale: string;
  readonly from?: string;
};

type Listener = () => void;

type TagMap<T> = Readonly<Record<string, (chunks: readonly (string | T)[]) => T>>;

type I18nOptions = {
  readonly base: string;
  readonly locale?: string;
  readonly layers?: readonly Layer[];
  readonly load?: (tag: string) => Promise<readonly Layer[]>;
  readonly onMissing?: (event: MissingEvent) => void;
  readonly dev?: boolean;
};

type I18nFormat = {
  readonly number: (value: number, options?: Intl.NumberFormatOptions) => string;
  readonly date: (value: Date | number, options?: Intl.DateTimeFormatOptions) => string;
  readonly list: (items: readonly string[], options?: Intl.ListFormatOptions) => string;
};

type I18n = {
  readonly locale: string;
  readonly chain: readonly string[];
  readonly dir: Direction;
  readonly t: <K extends MessageKey>(key: K, ...args: ArgsOf<K>) => string;
  readonly parts: <T, K extends MessageKey = MessageKey>(key: K, values: ValuesOf<K> | undefined, tags: TagMap<T>) => (string | T)[];
  readonly text: (text: Text) => string;
  readonly format: I18nFormat;
  readonly setLocale: (tag: string) => Promise<void>;
  readonly subscribe: (listener: Listener) => () => void;
};

export type { MissingEvent, Listener, TagMap, I18nOptions, I18nFormat, I18n };
