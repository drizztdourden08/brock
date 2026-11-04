/* @layer core @kind logic */
import type { MsuGameConfig } from '../config';
import { MSUL_MANIFEST_NAME } from '../manifest-io';
import { packDir } from '../paths';

const manifestPath = (config: MsuGameConfig, pack: string): string => `${packDir(config, pack)}/${MSUL_MANIFEST_NAME}`;

export { manifestPath };
