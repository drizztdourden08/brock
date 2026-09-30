/* @layer renderer-shell @kind hook */
import { useContext, useLayoutEffect } from 'react';
import { HeroSlotContext } from './hero-slot-context';
import type { HeroSlotName, HeroSlotValues } from './screen-kinds.type';

const useHeroSlot = <K extends HeroSlotName>(name: K, value: HeroSlotValues[K]): void => {
  const put = useContext(HeroSlotContext);
  useLayoutEffect(() => {
    put(name, value);
    return () => put(name, undefined);
  }, [put, name, value]);
};

export { useHeroSlot };
