/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { doctorReport } from '../src/platforms/doctor/doctor-report.mjs';
import type { DoctorSection } from '../src/platforms/doctor/doctor-report.mjs';

const BASE: DoctorSection = { title: 'Every app', results: [{ label: 'Node 24', status: 'ok', detail: 'v24.3.0' }, { label: 'pnpm', status: 'ok', detail: '10.17.0' }] };
const MAC: DoctorSection = { title: 'macOS', results: [{ label: 'Xcode command line tools', status: 'skip', detail: 'checked on macOS' }] };

const SECTIONS: DoctorSection[] = [
  BASE,
  {
    title: 'Android',
    results: [
      { label: 'JDK 21', status: 'missing', install: 'winget install EclipseAdoptium.Temurin.21.JDK' },
      { label: 'ANDROID_HOME', status: 'missing', detail: 'not set', install: 'set ANDROID_HOME' },
    ],
  },
  MAC,
  { title: 'Web', results: [] },
];

describe('doctorReport', () => {
  const report = doctorReport(SECTIONS);

  it('fails on a missing item and names each one', () => {
    expect(report.ok).toBe(false);
    expect(report.missing).toEqual(['JDK 21', 'ANDROID_HOME']);
    expect(report.lines.at(-1)).toBe('2 missing: JDK 21, ANDROID_HOME. Install them, then run doctor again.');
  });

  it('prints the install command under a missing item only', () => {
    const jdk = report.lines.findIndex((line) => line.includes('JDK 21') && line.includes('missing'));
    expect(report.lines[jdk + 1]).toContain('install: winget install EclipseAdoptium.Temurin.21.JDK');
    expect(report.lines.filter((line) => line.includes('install:'))).toHaveLength(2);
  });

  it('keeps a skipped check and an empty section visible', () => {
    expect(report.lines.some((line) => line.includes('skip') && line.includes('checked on macOS'))).toBe(true);
    expect(report.lines).toContain('    nothing beyond what every app needs');
  });

  it('passes when nothing is missing', () => {
    const passing = doctorReport([BASE, MAC]);
    expect(passing.ok).toBe(true);
    expect(passing.missing).toEqual([]);
  });
});
