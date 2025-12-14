import { BaseSimulator } from "./BaseSimulator";
import { InjectionType, RiskLevel, SimulationResult } from "../core/types";

export class TemplateInjectionSimulator extends BaseSimulator {
  type = InjectionType.TEMPLATE;

  async analyze(input: string): Promise<SimulationResult> {
    const patterns = [
      { regex: /\{\{.*\}\}/i, name: "Double Curly Braces ({{...}})" },
      { regex: /\$\{.*\}/i, name: "Template Literal (${...})" },
      { regex: /<%BaseSimulator.*%>/i, name: "ERB/EJS Tags (<%...%>)" },
      { regex: /#{.*}/i, name: "Ruby Interpolation (#{...})" },
    ];

    for (const pattern of patterns) {
      if (pattern.regex.test(input)) {
        return {
          type: this.type,
          riskLevel: RiskLevel.HIGH,
          input,
          detectedPattern: pattern.name,
          exploitationPotential:
            "Server-Side Template Injection (SSTI) can lead to RCE or sensitive data exposure.",
          preventionMeasure:
            "Do not concatenate user input into templates. Pass data as context properties to the template engine.",
          explanation: `
            The input contains template syntax "${pattern.name}".
            
            UNSAFE SIMULATION:
            Template: "Hello " + input
            Result: "Hello {{7*7}}" -> Renders as "Hello 49"
            
            If the engine evaluates this, an attacker can execute code.
          `,
        };
      }
    }

    return this.createSafeResult(
      input,
      "The input does not contain obvious template injection syntax. Ensure you treat this as data, not code, in your templates."
    );
  }
}
