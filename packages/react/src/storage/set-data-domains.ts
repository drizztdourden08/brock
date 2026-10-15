/* @layer renderer-shell @kind logic */
import type { DataDomainDef } from '@drizztdourden08/brock-core';
import { dataDomainsState } from './data-domains-state';

const setDataDomains = (domains: readonly DataDomainDef[]): void => {
  dataDomainsState.domains = domains;
};

export { setDataDomains };
