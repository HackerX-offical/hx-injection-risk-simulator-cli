import { PayloadFuzzer } from '../src/engines/PayloadFuzzer';
import { ISimulator, RiskLevel, SimulationResult, InjectionType } from '../src/core/types';

class StubSimulator implements ISimulator {
  type = InjectionType.SQL;

  constructor(private risky: Set<string>) {}

  async analyze(input: string): Promise<SimulationResult> {
    const high = this.risky.has(input);
    return {
      type: this.type,
      riskLevel: high ? RiskLevel.HIGH : RiskLevel.SAFE,
      input,
      detectedPattern: high ? 'stub' : undefined,
      exploitationPotential: high ? 'mock' : 'none',
      preventionMeasure: 'mock',
      explanation: 'mock',
    };
  }

  explain(): string {
    return 'stub';
  }
}

describe('PayloadFuzzer', () => {
  test('returns only non-safe simulator results', async () => {
    const fuzzer = new PayloadFuzzer(['evil'], false);
    const sim = new StubSimulator(new Set(['evil']));
    const results = await fuzzer.fuzz(sim);
    expect(results).toHaveLength(1);
    expect(results[0].input).toBe('evil');
  });

  test('merges custom payloads with defaults when enabled', () => {
    const fuzzer = new PayloadFuzzer(['custom-payload']);
    expect(fuzzer.getPayloads()).toContain('custom-payload');
    expect(fuzzer.getPayloads().length).toBeGreaterThan(1);
  });
});
