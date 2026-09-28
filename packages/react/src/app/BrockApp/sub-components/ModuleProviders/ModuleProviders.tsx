/* @layer renderer-shell @kind component */
import type { ReactNode } from 'react';
import type { ModuleProvidersProps } from './ModuleProviders.type';

const ModuleProviders = (props: ModuleProvidersProps) => {
  const { providers, children } = props;
  return providers.reduceRight<ReactNode>((inner, Provider) => <Provider>{inner}</Provider>, children);
};

export { ModuleProviders };
