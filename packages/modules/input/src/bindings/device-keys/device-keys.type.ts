/* @layer core @kind types */
type DeviceScopedMap<K, V> = Map<string, Map<K, V>>;

interface AllowedDevices {
  keyboard: boolean;
  gamepadKeys: Set<string>;
}

export type { AllowedDevices, DeviceScopedMap };
