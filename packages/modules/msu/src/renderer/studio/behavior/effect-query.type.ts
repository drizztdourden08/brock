/* @layer renderer-shell @kind types */
interface EffectQuery {
  channel: string | null;
  text: string;
}

interface PortTag {
  channel: string;
  tag: string;
}

export type { EffectQuery, PortTag };
