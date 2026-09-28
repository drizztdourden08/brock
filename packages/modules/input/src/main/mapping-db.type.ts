/* @layer electron-main @kind types */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { Sdl3Input } from './sdl3.type';

type MappingDbInput = Pick<MainContext, 'files' | 'paths' | 'log'> & {
  addon: Sdl3Input;
  bundledPath: string | undefined;
};

interface MappingDb {
  load: () => Promise<void>;
  add: (mapping: string) => Promise<boolean>;
  forGuid: (guid: string) => string | null;
}

export type { MappingDbInput, MappingDb };
