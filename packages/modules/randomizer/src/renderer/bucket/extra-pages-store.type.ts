/* @layer renderer-shell @kind type */
import type { LivePage } from '@drizztdourden08/brock-react';

interface ExtraPagesState {
  pages: readonly LivePage[];
  add(pages: readonly LivePage[]): void;
}

export type { ExtraPagesState };
