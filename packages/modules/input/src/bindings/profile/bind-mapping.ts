/* @layer core @kind logic */
import type { ActionBinding } from '../bindings.type';
import type { BindMappingParams } from './profile.type';

const bindMapping = ({ mapping, binding, vid, pid }: BindMappingParams): ActionBinding => {
  const fromDevice = binding.type !== 'keyboard';
  return {
    ...mapping,
    binding,
    icon: null,
    sourceVid: fromDevice ? vid : null,
    sourcePid: fromDevice ? pid : null,
  };
};

export { bindMapping };
