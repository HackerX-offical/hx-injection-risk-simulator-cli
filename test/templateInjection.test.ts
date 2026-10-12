import { TemplateInjectionSimulator } from '../src/engines/TemplateInjectionSimulator';
import { RiskLevel } from '../src/core/types';

describe('TemplateInjectionSimulator', () => {
  const simulator = new TemplateInjectionSimulator();

  test('flags mustache-style SSTI', async () => {
    const result = await simulator.analyze('{{7*7}}');
    expect(result.riskLevel).toBe(RiskLevel.HIGH);
    expect(result.detectedPattern).toContain('Double Curly');
  });

  test('flags template literal injection', async () => {
    const result = await simulator.analyze('${process.env}');
    expect(result.riskLevel).toBe(RiskLevel.HIGH);
  });

  test('allows plain text', async () => {
    const result = await simulator.analyze('hello world');
    expect(result.riskLevel).toBe(RiskLevel.SAFE);
  });
});
