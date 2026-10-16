/* @layer renderer-shell @kind hook */
import { useId } from 'react';
import type { ShowFlagValues } from './show.type';
import { useShowFlagsSource } from './useShowFlagsSource';

const useShowFlags = (values: ShowFlagValues): void => {
  useShowFlagsSource(`hook:${useId()}`, values);
};

export { useShowFlags };
