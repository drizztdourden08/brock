/* @layer core @kind types */
type LayerKind = 'package' | 'module' | 'app';

type Layer = {
  readonly locale: string;
  readonly namespace: string;
  readonly messages: Readonly<Record<string, string>>;
  readonly kind?: LayerKind;
};

type Hit = { readonly text: string; readonly locale: string };

type Catalog = {
  readonly add: (layers: readonly Layer[]) => void;
  readonly has: (tag: string) => boolean;
  readonly find: (tag: string, key: string) => string | undefined;
};

export type { LayerKind, Layer, Hit, Catalog };
