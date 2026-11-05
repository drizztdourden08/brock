/* @layer core @kind types */
import type { FakeCore } from './fake-core.type';

interface FakeCoreLink {
  killLink(): 'armed' | 'down';
  onLinkDied(f: (cause: string) => void): () => void;
  die: FakeCore['die'];
}

export type { FakeCoreLink };
