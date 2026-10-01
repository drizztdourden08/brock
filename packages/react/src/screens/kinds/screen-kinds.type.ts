/* @layer renderer-shell @kind types */
import type { ComponentType, ReactNode } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';
import type { FactsPanelGroup, HeroArt, HeroProps as HeroCompositeProps } from '@drizztdourden08/tessera/composites';
import type { ScreenParams } from '../../navigation/navigation.type';
import type { BucketDef } from '../conventions/screens-config.type';

type Open = (target: string, params?: ScreenParams) => void;

interface CardProps {
  params: ScreenParams;
  profile: Profile | null;
  open: Open;
  close: () => void;
}

interface PageProps extends CardProps {
  bucket: BucketDef;
  page: string;
  tab: string | null;
}

interface HeroSlotProps {
  children?: ReactNode;
}

interface HeroActionsProps {
  children: ReactNode;
}

type HeroArtProps = HeroArt;

interface HeroFactsProps {
  rows: readonly FactsPanelGroup[];
}

interface HeroSlots {
  Title: ComponentType<HeroSlotProps>;
  Eyebrow: ComponentType<HeroSlotProps>;
  Backdrop: ComponentType<HeroSlotProps>;
  Art: ComponentType<HeroArtProps>;
  Actions: ComponentType<HeroActionsProps>;
  Tools: ComponentType<HeroSlotProps>;
  Facts: ComponentType<HeroFactsProps>;
  Aside: ComponentType<HeroSlotProps>;
  Panel: ComponentType<HeroSlotProps>;
}

type HeroSlotValues = Partial<Pick<HeroCompositeProps, 'title' | 'eyebrow' | 'backdrop' | 'art' | 'actions' | 'tools' | 'facts' | 'aside' | 'panel'>>;

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
  CardProps, HeroActionsProps, HeroArtProps, HeroFactsProps, HeroFrame, HeroProps, HeroRootProps, HeroSlotName, HeroSlotProps, HeroSlotValues,
  HeroSlots, Open, PageProps, PutHeroSlot,
};
