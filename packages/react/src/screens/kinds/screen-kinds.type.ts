/* @layer renderer-shell @kind types */
import type { ComponentType, ReactNode } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';
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
  className?: string;
}

interface HeroArtProps {
  src: string;
  alt: string;
  className?: string;
}

interface HeroActionsProps {
  children: ReactNode;
  className?: string;
}

interface HeroSlots {
  Backdrop: ComponentType<HeroSlotProps>;
  Art: ComponentType<HeroArtProps>;
  Facts: ComponentType<HeroSlotProps>;
  Actions: ComponentType<HeroActionsProps>;
}

interface HeroProps extends PageProps {
  slots: HeroSlots;
}

interface HeroFrame<P extends HeroSlotProps = HeroSlotProps> {
  Root: ComponentType<P>;
  rootProps: Omit<P, 'children'>;
  slots: HeroSlots;
}

export type { CardProps, HeroActionsProps, HeroArtProps, HeroFrame, HeroProps, HeroSlotProps, HeroSlots, Open, PageProps };
