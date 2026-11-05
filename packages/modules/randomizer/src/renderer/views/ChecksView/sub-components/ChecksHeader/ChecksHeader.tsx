/* @layer renderer-shell @kind component */
import { Stack } from '@drizztdourden08/tessera/primitives';
import { AssumptionToggles } from '../AssumptionToggles';
import { ChecksFilters } from '../ChecksFilters';
import { ChecksSummary } from '../ChecksSummary';
import type { ChecksHeaderProps } from './ChecksHeader.type';

const ChecksHeader = ({ provider, counts, search, onSearch, prefs, active }: ChecksHeaderProps) => {
  const [, setAssumed] = prefs.assumed;
  return (
    <Stack gap="sm">
      <ChecksSummary counts={counts} />
      <ChecksFilters provider={provider} search={search} onSearch={onSearch} prefs={prefs} />
      <AssumptionToggles assumptions={provider.assumptions ?? []} active={active} onChange={setAssumed} />
    </Stack>
  );
};

export { ChecksHeader };
