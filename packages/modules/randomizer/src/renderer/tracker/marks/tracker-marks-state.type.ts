/* @layer renderer-shell @kind types */
interface TrackerMarksState {
  profileId: string | null;
  marks: ReadonlySet<string>;
  load(profileId: string | null): Promise<void>;
  toggle(location: string): void;
}

export type { TrackerMarksState };
