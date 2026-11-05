/* @layer renderer-shell @kind types */
interface MsuSoundRoles {
  labels: Record<string, string>;
  hints: Record<string, string>;
}

interface MsuSoundTab {
  id: string;
  label: string;
  channels: readonly [string] | readonly [string, string];
  roles?: MsuSoundRoles;
}

export type { MsuSoundRoles, MsuSoundTab };
