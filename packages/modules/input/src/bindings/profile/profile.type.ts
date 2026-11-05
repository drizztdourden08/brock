/* @layer core @kind types */
import type { ActionBinding, InputBinding } from '../bindings.type';
import type { InputProfile } from '../input-profile.type';

interface BindMappingParams {
  mapping: ActionBinding;
  binding: InputBinding;
  vid: string | null;
  pid: string | null;
}

interface BindProfileActionParams {
  profile: InputProfile;
  action: string;
  binding: InputBinding;
  vid: string | null;
  pid: string | null;
}

interface ClearProfileActionParams {
  profile: InputProfile;
  action: string;
  mappingIndex: number;
}

interface BindGlobalActionParams {
  mappings: readonly ActionBinding[];
  action: string;
  binding: InputBinding;
  vid: string | null;
  pid: string | null;
}

export type { BindGlobalActionParams, BindMappingParams, BindProfileActionParams, ClearProfileActionParams };
