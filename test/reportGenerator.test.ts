import fs from 'fs';
import os from 'os';
import path from 'path';
import { ReportGenerator } from '../src/reporting/ReportGenerator';
import { InjectionType, RiskLevel, SimulationResult } from '../src/core/types';

const sample: SimulationResult[] = [
  {
    type: InjectionType.SQL,
    riskLevel: RiskLevel.HIGH,
    input: "' OR '1'='1",
    detectedPattern: 'Logic Bypass',
    exploitationPotential: 'Bypass auth',
    preventionMeasure: 'Use parameterized queries',
    explanation: 'demo',
  },
];

describe('ReportGenerator', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hx-inj-report-'));

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('writes JSON report with summary', () => {
    const out = path.join(tmpDir, 'report.json');
    ReportGenerator.generateJSON(sample, out);
    const parsed = JSON.parse(fs.readFileSync(out, 'utf8'));
    expect(parsed.summary.total).toBe(1);
    expect(parsed.summary.highRisk).toBe(1);
    expect(parsed.results[0].input).toContain('OR');
  });

  test('writes markdown report', () => {
    const out = path.join(tmpDir, 'report.md');
    ReportGenerator.generateMarkdown(sample, out);
    const md = fs.readFileSync(out, 'utf8');
    expect(md).toContain('# HX Injection Risk Report');
    expect(md).toContain('Logic Bypass');
  });
});
