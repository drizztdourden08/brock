/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { DynamicInput } from '@drizztdourden08/tessera/composites';
import { addressListsOf } from '../../behavior/address-lists-of';
import { addressSlotsOf } from '../../behavior/address-slots-of';
import { ADDRESS_LABEL, HOST_PATTERN, IP_PATTERN } from './RemoteAddress.constants';
import type { RemoteAddressProps } from './RemoteAddress.type';

const RemoteAddress = ({ value, onChange, disabled }: RemoteAddressProps) => {
  const text = useText();
  return (
    <DynamicInput
      className="lobby-setup__address"
      pattern={value.kind === 'ip' ? IP_PATTERN : HOST_PATTERN}
      lists={addressListsOf(text)}
      slots={addressSlotsOf(text)}
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-label={text(ADDRESS_LABEL)}
    />
  );
};

export { RemoteAddress };
