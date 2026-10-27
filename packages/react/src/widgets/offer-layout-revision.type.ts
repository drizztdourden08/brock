/* @layer renderer-shell @kind types */
interface RevisionOffer {
  profileId: string;
  target: number;
  boundTo: () => string | null;
}

export type { RevisionOffer };
