/* @layer renderer-shell @kind constants */
import { Box, ButtonRow, Flex, Image, Stack } from '@drizztdourden08/tessera/primitives';
import type { FlexProps } from '@drizztdourden08/tessera/primitives';
import type { HeroFrame } from './screen-kinds.type';

const HERO_FRAME: HeroFrame<FlexProps> = {
  Root: Flex,
  rootProps: { direction: 'column', align: 'center', gap: 'lg' },
  slots: { Backdrop: Box, Art: Image, Facts: Stack, Actions: ButtonRow },
};

export { HERO_FRAME };
