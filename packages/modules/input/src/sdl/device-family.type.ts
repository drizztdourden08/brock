/* @layer core @kind types */
type DeviceFamily =
  | 'xbox'
  | 'playstation'
  | 'nintendo'
  | '8bitdo'
  | 'keyboard'
  | 'generic';

type DeviceInputApi = 'hid' | 'webapi';

export type { DeviceFamily, DeviceInputApi };
