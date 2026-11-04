/* @layer renderer-shell @kind types */
interface TrackerMarks {
  marks: ReadonlySet<string>;
  toggle(location: string): void;
}

export type { TrackerMarks };
