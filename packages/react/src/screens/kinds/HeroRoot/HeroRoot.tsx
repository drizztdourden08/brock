/* @layer renderer-shell @kind component */
import { useCallback, useContext, useMemo, useState } from 'react';
import { BrockContext } from '../../../app/brock-context';
import { heroBrandArt } from '../hero-brand-art';
import { heroBrandOf } from '../hero-brand-of';
import { HeroSlotContext } from '../hero-slot-context';
import type { HeroRootProps, HeroSlotValues, PutHeroSlot } from '../screen-kinds.type';

const HeroRoot = (props: HeroRootProps) => {
  const { frame, children } = props;
  const { Composite, label } = frame;
  const brand = heroBrandOf(useContext(BrockContext)?.product.icons.brand);
  const brandArt = useMemo(() => heroBrandArt(brand), [brand]);
  const [values, setValues] = useState<HeroSlotValues>({});
  const put = useCallback<PutHeroSlot>((name, value) => {
    setValues((prev) => (prev[name] === value ? prev : { ...prev, [name]: value }));
  }, []);

  const art = values.art ?? brandArt;

  return (
    <HeroSlotContext.Provider value={put}>
      <Composite {...values} art={art} brand={brand} title={values.title} label={label} />
      {children}
    </HeroSlotContext.Provider>
  );
};

export { HeroRoot };
