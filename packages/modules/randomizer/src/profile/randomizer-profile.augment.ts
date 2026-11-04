/* @layer core @kind types */
import type { RandomizerProfileConfig } from './randomizer-profile.type';

declare module '@drizztdourden08/brock-core/augment' {
  interface ProfileExtension {
    randomizer?: RandomizerProfileConfig;
  }
  interface ProfileCreateExtension {
    randomizer?: RandomizerProfileConfig;
  }
  interface ProfilePatchExtension {
    randomizer?: RandomizerProfileConfig;
  }
}

export type { RandomizerProfileConfig };
