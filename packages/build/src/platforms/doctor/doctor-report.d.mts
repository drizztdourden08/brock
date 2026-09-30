/* @layer tooling-scripts @kind types */
interface LabelledResult {
  label: string;
  status: 'ok' | 'missing' | 'skip';
  detail?: string;
  install?: string;
}

interface DoctorSection {
  title: string;
  results: LabelledResult[];
}

declare const doctorReport: (sections: DoctorSection[]) => { ok: boolean; missing: string[]; lines: string[] };

export { doctorReport };
export type { DoctorSection, LabelledResult };
