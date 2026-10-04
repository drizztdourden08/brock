/* @layer renderer-shell @kind types */
import type { ComponentType, ReactNode } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';
import type { FactsPanelGroup, HeroArt, HeroBackdrop, HeroProps as HeroCompositeProps, HeroShade } from '@drizztdourden08/tessera/composites';
import type { ScreenParams } from '../../navigation/navigation.type';
import type { BucketDef } from '../conventions/screens-config.type';

type Open = (target: string, params?: ScreenParams) => void;

interface CardProps {
  params: ScreenParams;
  profile: Profile | null;
  open: Open;
  close: () => void;
}

type BaseProps = CardProps;

interface PageProps extends CardProps {
  bucket: BucketDef;
  page: string;
  tab: string | null;
  openSub: (sub: string, params?: Record<string, string>) => void;
}

interface SubPageProps extends PageProps {
  sub: string;
  subParams: Record<string, string>;
  back: () => void;
}

interface HeroSlotProps {
  children?: ReactNode;
}

interface HeroActionsProps {
  children: ReactNode;
}

type HeroArtProps = HeroArt;

type HeroBackdropProps = HeroBackdrop | { kind: 'none' };

interface HeroShadeProps {
  value: HeroShade;
}

interface HeroFactsProps {
  rows: readonly FactsPanelGroup[];
}

interface HeroSlots {
  Title: ComponentType<HeroSlotProps>;
  Eyebrow: ComponentType<HeroSlotProps>;
  Backdrop: ComponentType<HeroBackdropProps>;
  Shade: ComponentType<HeroShadeProps>;
  Art: ComponentType<HeroArtProps>;
  Actions: ComponentType<HeroActionsProps>;
  Tools: ComponentType<HeroSlotProps>;
  Facts: ComponentType<HeroFactsProps>;
  Aside: ComponentType<HeroSlotProps>;
  Panel: ComponentType<HeroSlotProps>;
}

type HeroSlotValues = Partial<Pick<HeroCompositeProps, 'title' | 'eyebrow' | 'backdrop' | 'shade' | 'art' | 'actions' | 'tools' | 'facts' | 'aside' | 'panel'>>;

type HeroSlotName = keyof HeroSlotValues;

type PutHeroSlot = (name: HeroSlotName, value: HeroSlotValues[HeroSlotName]) => void;

interface HeroProps extends PageProps {
  slots: HeroSlots;
}

interface HeroFrame {
  Composite: ComponentType<HeroCompositeProps>;
  slots: HeroSlots;
  label?: string;
}

interface HeroRootProps {
  frame: HeroFrame;
  children?: ReactNode;
}

export type {
  BaseProps, CardProps, HeroActionsProps, HeroArtProps, HeroBackdropProps, HeroFactsProps, HeroFrame, HeroProps, HeroRootProps, HeroShadeProps, HeroSlotName, HeroSlotProps,
  HeroSlotValues, HeroSlots, Open, PageProps, PutHeroSlot, SubPageProps,
};
