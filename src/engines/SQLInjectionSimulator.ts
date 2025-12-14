import { BaseSimulator } from "./BaseSimulator";
import { InjectionType, RiskLevel, SimulationResult } from "../core/types";
import { MockDatabase } from "../sandbox/MockDatabase";
import { Tokenizer } from "../utils/Tokenizer";

export class SQLInjectionSimulator extends BaseSimulator {
  type = InjectionType.SQL;
  private db: MockDatabase;

  constructor() {
    super();
    this.db = new MockDatabase();
  }

  async analyze(input: string): Promise<SimulationResult> {
    this.db.reset(); // Reset state before analysis

    // 1. Static Analysis (Tokenization)
    const tokens = Tokenizer.tokenizeSQL(input);
    const riskKeywords = tokens.filter((t) =>
      ["UNION", "DROP", "OR"].includes(t.value)
    );

    // 2. Dynamic Analysis (Sandbox Execution)
    // We wrap the input in a standard "vulnerable" query
    const vulnerableQuery = `SELECT * FROM users WHERE username = '${input}'`;
    const results = this.db.executeQuery(vulnerableQuery);

    // Check if we bypassed the logic
    // Normal query for a single user should return 0 or 1 result.
    // Tautology often returns ALL users.
    const bypassed = results.length > 1;

    if (bypassed || riskKeywords.length > 0) {
      let details = "";
      if (bypassed) {
        details += `[CRITICAL] Logic Bypass Detected! Query returned ${results.length} rows instead of 1.\n`;
      }
      if (riskKeywords.length > 0) {
        details += `[WARNING] Dangerous SQL Keywords detected: ${riskKeywords
          .map((t) => t.value)
          .join(", ")}\n`;
      }

      return {
        type: this.type,
        riskLevel: RiskLevel.HIGH,
        input,
        detectedPattern:
          riskKeywords.length > 0 ? riskKeywords[0].value : "Logic Bypass",
        exploitationPotential:
          "Full database dump, authentication bypass, or data loss.",
        preventionMeasure:
          "Use Parameterized Queries (Prepared Statements) to separate code from data.",
        explanation: `
            ${details}
            
            SIMULATED EXECUTION:
            Query: "${vulnerableQuery}"
            Result Count: ${results.length}
            
            Because the input was concatenated directly, the database interpreted it as code.
          `,
      };
    }

    return this.createSafeResult(
      input,
      "The input did not trigger any logic bypass or risky keyword detection in the sandbox."
    );
  }
}
