/* @layer renderer-shell @kind constants */
import { Hero } from '@drizztdourden08/tessera/composites';
import { heroSlot } from './hero-slot';
import { heroArtOf } from './hero-art-of';
import { heroBackdropOf } from './hero-backdrop-of';
import type { HeroActionsProps, HeroFactsProps, HeroFrame, HeroShadeProps, HeroSlotProps } from './screen-kinds.type';

const childrenOf = (props: HeroSlotProps) => props.children;

const HERO_FRAME: HeroFrame = {
  Composite: Hero,
  slots: {
    Title: heroSlot('title', childrenOf),
    Eyebrow: heroSlot('eyebrow', childrenOf),
    Backdrop: heroSlot('backdrop', heroBackdropOf),
    Shade: heroSlot('shade', (props: HeroShadeProps) => props.value),
    Art: heroSlot('art', heroArtOf),
    Actions: heroSlot('actions', (props: HeroActionsProps) => props.children),
    Tools: heroSlot('tools', childrenOf),
    Facts: heroSlot('facts', (props: HeroFactsProps) => props.rows),
    Aside: heroSlot('aside', childrenOf),
    Panel: heroSlot('panel', childrenOf),
  },
};

export { HERO_FRAME };
