/* @layer renderer-shell @kind logic */
import type { ComponentType } from 'react';
import type { HeroSlotName, HeroSlotValues } from './screen-kinds.type';
import { useHeroSlot } from './useHeroSlot';

const heroSlot = <P extends object, K extends HeroSlotName>(name: K, valueOf: (props: P) => HeroSlotValues[K]): ComponentType<P> => {
  const HeroSlot = (props: P) => {
    useHeroSlot(name, valueOf(props));
    return null;
  };
  return HeroSlot;
};

export { heroSlot };
