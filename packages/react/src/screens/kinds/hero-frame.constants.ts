/* @layer renderer-shell @kind constants */
import { Hero } from '@drizztdourden08/tessera/composites';
import { heroSlot } from './hero-slot';
import type { HeroActionsProps, HeroArtProps, HeroFactsProps, HeroFrame, HeroSlotProps } from './screen-kinds.type';

const childrenOf = (props: HeroSlotProps) => props.children;

const HERO_FRAME: HeroFrame = {
  Composite: Hero,
  slots: {
    Title: heroSlot('title', childrenOf),
    Eyebrow: heroSlot('eyebrow', childrenOf),
    Backdrop: heroSlot('backdrop', childrenOf),
    Art: heroSlot('art', (props: HeroArtProps) => ({ src: props.src, alt: props.alt, pixelated: props.pixelated })),
    Actions: heroSlot('actions', (props: HeroActionsProps) => props.children),
    Tools: heroSlot('tools', childrenOf),
    Facts: heroSlot('facts', (props: HeroFactsProps) => props.rows),
    Aside: heroSlot('aside', childrenOf),
    Panel: heroSlot('panel', childrenOf),
  },
};

export { HERO_FRAME };
