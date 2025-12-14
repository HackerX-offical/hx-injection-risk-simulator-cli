import { SQLInjectionSimulator } from "../src/engines/SQLInjectionSimulator";
import { CommandInjectionSimulator } from "../src/engines/CommandInjectionSimulator";
import { RiskLevel } from "../src/core/types";

describe("SQLInjectionSimulator", () => {
  let simulator: SQLInjectionSimulator;

  beforeEach(() => {
    simulator = new SQLInjectionSimulator();
  });

  test("should detect basic tautology", async () => {
    const result = await simulator.analyze("' OR '1'='1");
    expect(result.riskLevel).toBe(RiskLevel.HIGH);
    expect(result.detectedPattern).toContain("Logic Bypass");
  });

  test("should detect UNION attacks", async () => {
    const result = await simulator.analyze("' UNION SELECT * FROM users --");
    expect(result.riskLevel).toBe(RiskLevel.HIGH);
    expect(result.detectedPattern).toBe("UNION");
  });

  test("should allow safe input", async () => {
    const result = await simulator.analyze("admin");
    expect(result.riskLevel).toBe(RiskLevel.SAFE);
  });
});

describe("CommandInjectionSimulator", () => {
  let simulator: CommandInjectionSimulator;

  beforeEach(() => {
    simulator = new CommandInjectionSimulator();
  });

  test("should detect sensitive file access", async () => {
    const result = await simulator.analyze("; cat /etc/passwd");
    expect(result.riskLevel).toBe(RiskLevel.HIGH);
  });

  test("should detect command chaining", async () => {
    const result = await simulator.analyze("| whoami");
    expect(result.riskLevel).toBe(RiskLevel.HIGH);
    expect(result.detectedPattern).toContain("Command Chaining");
  });

  test("should allow safe input", async () => {
    const result = await simulator.analyze("google.com");
    expect(result.riskLevel).toBe(RiskLevel.SAFE);
  });
});
