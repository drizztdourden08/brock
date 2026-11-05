/* @layer core @kind logic */
import path from 'node:path';
import type { ApworldRigConfig } from './apworld-rig.type';

const generatorPath = (config: ApworldRigConfig): string => path.join(config.apDir, 'ArchipelagoGenerate.exe');

export { generatorPath };
