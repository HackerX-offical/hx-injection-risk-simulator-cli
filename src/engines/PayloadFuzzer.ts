import { ISimulator, SimulationResult, RiskLevel } from "../core/types";

export class PayloadFuzzer {
  private payloads: string[] = [
    "' OR '1'='1",
    "admin' --",
    "; cat /etc/passwd",
    "| whoami",
    "{{7*7}}",
    "<script>alert(1)</script>", // XSS, for completeness/future
    "${jndi:ldap://...}",
  ];

  constructor(customPayloads: string[] = [], enableDefault: boolean = true) {
    if (!enableDefault) {
      this.payloads = [];
    }
    this.payloads = [...this.payloads, ...customPayloads];
  }

  public async fuzz(simulator: ISimulator): Promise<SimulationResult[]> {
    const results: SimulationResult[] = [];

    for (const payload of this.payloads) {
      const result = await simulator.analyze(payload);
      if (result.riskLevel !== RiskLevel.SAFE) {
        results.push(result);
      }
    }

    return results;
  }

  public getPayloads(): string[] {
    return this.payloads;
  }
}
