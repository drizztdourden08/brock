/* @layer renderer-shell @kind types */
import type { ScreenMeta } from '../../screens/conventions/screens-config.type';

type SeedMeta = Pick<ScreenMeta, 'title' | 'icon' | 'keywords' | 'searchRows' | 'devOnly'>;

export type { SeedMeta };
