/* @layer core @kind types */
interface CoreSignal {
  state(): { status: string };
  subscribe(fn: () => void): () => void;
}

export type { CoreSignal };
