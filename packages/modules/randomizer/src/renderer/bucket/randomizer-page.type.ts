/* @layer renderer-shell @kind type */
import type { LivePage, ShowContext } from '@drizztdourden08/brock-react';

interface RandomizerPage extends LivePage {
  route?: string;
  order?: number;
  when?: (ctx: ShowContext) => boolean;
}

export type { RandomizerPage };
