import { BaseSimulator } from "./BaseSimulator";
import { InjectionType, RiskLevel, SimulationResult } from "../core/types";
import { MockFileSystem } from "../sandbox/MockFileSystem";

export class CommandInjectionSimulator extends BaseSimulator {
  type = InjectionType.COMMAND;
  private fs: MockFileSystem;

  constructor() {
    super();
    this.fs = new MockFileSystem();
  }

  async analyze(input: string): Promise<SimulationResult> {
    this.fs.reset();

    // Regex for shell risk (simplified tokenization)
    const riskPatterns = [
      { regex: /;|\||&&/g, name: "Command Chaining Operator" },
      { regex: /\$\(|`/g, name: "Command Substitution" },
      { regex: />/g, name: "Redirection" },
    ];

    let detectedRisk = null;
    for (const p of riskPatterns) {
      if (p.regex.test(input)) {
        detectedRisk = p.name;
        break;
      }
    }

    // Dynamic Analysis: Run in Sandbox
    const baseCommand = "ping -c 4 ";
    const fullCommand = baseCommand + input;

    // Simulate execution
    const output = this.fs.simulateCommandExecution(fullCommand);
    const accessedFiles = this.fs.getState().accessLog;

    // Detection Logic
    // If we accessed sensitive files (like /etc/passwd) OR if the output implies code execution beyond "ping"
    const sensitiveAccess = accessedFiles.some(
      (f) => f.includes("/etc/passwd") || f.includes("/root")
    );
    const unexpectedOutput =
      output.includes("root:x:") || output.includes("Simulating deletion");

    if (detectedRisk || sensitiveAccess || unexpectedOutput) {
      return {
        type: this.type,
        riskLevel: RiskLevel.HIGH,
        input,
        detectedPattern: detectedRisk || "Unsafe Execution Behavior",
        exploitationPotential:
          "Remote Code Execution (RCE), System Compromise.",
        preventionMeasure:
          "Avoid `exec()` with user input. Use `execFile()` with arguments array, or input validation.",
        explanation: `
            Analysis detected dangerous behavior.
            
            SANDBOX TRACE:
            Command: "${fullCommand}"
            Files Accessed: ${
              accessedFiles.length > 0 ? accessedFiles.join(", ") : "None"
            }
            Output Snippet: "${output.substring(0, 50)}..."
            
            The simulator observed that the input caused unexpected system interaction.
          `,
      };
    }

    return this.createSafeResult(
      input,
      "The input appeared to execute responsibly within the sandbox logic."
    );
  }
}
