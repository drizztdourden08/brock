/* @layer renderer-shell @kind component */
import { useCallback, useState } from 'react';
import { HeroSlotContext } from '../hero-slot-context';
import type { HeroRootProps, HeroSlotValues, PutHeroSlot } from '../screen-kinds.type';

const HeroRoot = (props: HeroRootProps) => {
  const { frame, children } = props;
  const { Composite, label } = frame;
  const [values, setValues] = useState<HeroSlotValues>({});
  const put = useCallback<PutHeroSlot>((name, value) => {
    setValues((prev) => (prev[name] === value ? prev : { ...prev, [name]: value }));
  }, []);

  return (
    <HeroSlotContext.Provider value={put}>
      <Composite {...values} title={values.title} label={label} />
      {children}
    </HeroSlotContext.Provider>
  );
};

export { HeroRoot };
