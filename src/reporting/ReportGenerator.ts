import { SimulationResult } from "../core/types";
import fs from "fs";
import path from "path";

export class ReportGenerator {
  public static generateJSON(
    results: SimulationResult[],
    outputPath: string = "hx-report.json"
  ): void {
    const report = {
      timestamp: new Date().toISOString(),
      tool: "HX Injection Risk Simulator",
      summary: {
        total: results.length,
        highRisk: results.filter((r) => r.riskLevel === "HIGH").length,
      },
      results,
    };

    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  }

  public static generateMarkdown(
    results: SimulationResult[],
    outputPath: string = "hx-report.md"
  ): void {
    let md = `# HX Injection Risk Report\n\n`;
    md += `**Date:** ${new Date().toLocaleString()}\n`;
    md += `**Risk Summary:** Found ${
      results.filter((r) => r.riskLevel === "HIGH").length
    } risky inputs.\n\n`;

    results.forEach((r, i) => {
      md += `## Input ${i + 1}\n`;
      md += `- **Input:** \`${r.input}\`\n`;
      md += `- **Type:** ${r.type}\n`;
      md += `- **Risk:** ${r.riskLevel}\n`;
      md += `- **Detection:** ${r.detectedPattern || "None"}\n`;
      md += `> ${r.exploitationPotential}\n\n`;
    });

    fs.writeFileSync(outputPath, md);
  }
}
