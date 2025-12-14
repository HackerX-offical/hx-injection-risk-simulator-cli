import { SimulationResult, RiskLevel } from "../core/types";
import chalk from "chalk";
import boxen from "boxen";

export class ExplainerEngine {
  public static generateReport(result: SimulationResult): string {
    if (result.riskLevel === RiskLevel.SAFE) {
      return this.generateSafeReport(result);
    }
    return this.generateDangerReport(result);
  }

  private static generateSafeReport(result: SimulationResult): string {
    return boxen(
      chalk.green.bold("✓ SAFE INPUT DETECTED") +
        "\n\n" +
        chalk.white(result.explanation),
      { padding: 1, borderColor: "green", borderStyle: "round" }
    );
  }

  private static generateDangerReport(result: SimulationResult): string {
    const header = chalk.red.bold("⚠ SECURITY VULNERABILITY DETECTED ⚠");

    const vectorInfo = `
${chalk.bold("Attack Vector:")} ${result.type}
${chalk.bold("Risk Level:")} ${result.riskLevel}
${chalk.bold("Pattern:")} ${result.detectedPattern}
`;

    const impactSection = `
${chalk.bold.underline("POTENTIAL IMPACT")}
${chalk.red(result.exploitationPotential)}
`;

    const technicalDeepDive = `
${chalk.bold.underline("TECHNICAL ANALYSIS")}
The input "${chalk.cyan(
      result.input
    )}" was interpreted as code by the simulator.
This breaks the "Data-Code Separation" principle.

${result.explanation}
`;

    const remediation = `
${chalk.bold.underline("REMEDIATION")}
${chalk.green(result.preventionMeasure)}

${chalk.dim("Ref: OWASP Injection Prevention Cheat Sheet")}
`;

    return boxen(
      header +
        "\n" +
        vectorInfo +
        impactSection +
        technicalDeepDive +
        remediation,
      { padding: 1, borderColor: "red", borderStyle: "double" }
    );
  }
}
