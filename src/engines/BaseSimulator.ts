import {
  ISimulator,
  InjectionType,
  SimulationResult,
  RiskLevel,
} from "../core/types";

export abstract class BaseSimulator implements ISimulator {
  abstract type: InjectionType;

  /**
   * core analysis logic to be implemented by specific simulators
   */
  abstract analyze(input: string): Promise<SimulationResult>;

  /**
   * Generates a standard explanation based on the result.
   * Can be overridden for more specific explanations.
   */
  explain(result: SimulationResult): string {
    const header = `[Analysis Result]: ${result.riskLevel} Risk`;
    const details = `
      Input: "${result.input}"
      Detected Pattern: ${result.detectedPattern || "None"}
      Potential Impact: ${result.exploitationPotential || "None"}
    `;
    const guidance = `
      Prevention: ${result.preventionMeasure}
      
      Educational Note: ${result.explanation}
    `;

    return `${header}\n${details}\n${guidance}`;
  }

  protected createSafeResult(
    input: string,
    explanation: string
  ): SimulationResult {
    return {
      type: this.type,
      riskLevel: RiskLevel.SAFE,
      input,
      preventionMeasure:
        "Keep using secure coding practices (parameterization, input validation, output encoding).",
      explanation,
    };
  }
}
