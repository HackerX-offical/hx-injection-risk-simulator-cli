import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { InjectionType, ISimulator, SimulationResult } from "../core/types";
import { SQLInjectionSimulator } from "../engines/SQLInjectionSimulator";
import { CommandInjectionSimulator } from "../engines/CommandInjectionSimulator";
import { TemplateInjectionSimulator } from "../engines/TemplateInjectionSimulator";
import { Scenarios } from "../scenarios/Scenarios";
import { ExplainerEngine } from "../explainer/ExplainerEngine";
import { PayloadFuzzer } from "../engines/PayloadFuzzer";
import { ReportGenerator } from "../reporting/ReportGenerator";
import { ConfigLoader } from "../utils/ConfigLoader";

export class CLI {
  private simulators: Map<InjectionType, ISimulator>;
  private fuzzer: PayloadFuzzer;

  constructor() {
    this.simulators = new Map();
    this.simulators.set(InjectionType.SQL, new SQLInjectionSimulator());
    this.simulators.set(InjectionType.COMMAND, new CommandInjectionSimulator());
    this.simulators.set(
      InjectionType.TEMPLATE,
      new TemplateInjectionSimulator()
    );

    const config = ConfigLoader.load();
    this.fuzzer = new PayloadFuzzer(
      config.fuzzer.customPayloads,
      config.fuzzer.enableDefaultPayloads
    );
  }

  public async start() {
    console.clear();
    console.log(
      chalk.bold.magenta("\n╔════════════════════════════════════════╗")
    );
    console.log(
      chalk.bold.magenta("║   HX INJECTION RISK SIMULATOR - ENT.   ║")
    );
    console.log(
      chalk.bold.magenta("╚════════════════════════════════════════╝")
    );
    console.log(chalk.gray("Advanced Educational Security Tool | v2.0.0\n"));

    while (true) {
      const { action } = await inquirer.prompt([
        {
          type: "list",
          name: "action",
          message: "Select Operation Mode:",
          choices: [
            { name: "🔍 Interactive Simulation", value: "simulate" },
            { name: "📚 Educational Scenarios", value: "scenarios" },
            { name: "💣 Auto-Fuzzing (Advanced)", value: "fuzz" },
            { name: "🚪 Exit", value: "exit" },
          ],
        },
      ]);

      if (action === "exit") break;
      if (action === "simulate") await this.runInteractive();
      if (action === "scenarios") await this.runScenarios();
      if (action === "fuzz") await this.runFuzzer();
    }
  }

  private async runInteractive() {
    const { type } = await inquirer.prompt([
      {
        type: "list",
        name: "type",
        message: "Select Injection Vector:",
        choices: Object.values(InjectionType),
      },
    ]);

    const { input } = await inquirer.prompt([
      {
        type: "input",
        name: "input",
        message: "Enter payload string:",
      },
    ]);

    const simulator = this.simulators.get(type as InjectionType);
    if (!simulator) return;

    const spinner = ora("Initializing Sandbox & Analyzing Tokens...").start();
    await new Promise((r) => setTimeout(r, 800)); // Fake delay for "complexity" feel
    const result = await simulator.analyze(input);
    spinner.succeed("Analysis Complete");

    console.log(ExplainerEngine.generateReport(result));
    await this.askToSave([result]);
  }

  private async runScenarios() {
    const { scenarioName } = await inquirer.prompt([
      {
        type: "list",
        name: "scenarioName",
        message: "Select a Scenario:",
        choices: [...Scenarios.map((s) => s.name), "Back"],
      },
    ]);

    if (scenarioName === "Back") return;
    const scenario = Scenarios.find((s) => s.name === scenarioName);
    if (!scenario) return;

    const { version } = await inquirer.prompt([
      {
        type: "list",
        name: "version",
        message: "Select Variant:",
        choices: [
          { name: `🔴 Unsafe: "${scenario.unsafeInput}"`, value: "unsafe" },
          { name: `🟢 Safe: "${scenario.safeInput}"`, value: "safe" },
        ],
      },
    ]);

    const input =
      version === "unsafe" ? scenario.unsafeInput : scenario.safeInput;
    const simulator = this.simulators.get(scenario.type);
    if (!simulator) return;

    const spinner = ora("Loading Scenario Context...").start();
    await new Promise((r) => setTimeout(r, 600));
    const result = await simulator.analyze(input);
    spinner.succeed("Scenario Executed");

    console.log(ExplainerEngine.generateReport(result));
  }

  private async runFuzzer() {
    const { type } = await inquirer.prompt([
      {
        type: "list",
        name: "type",
        message: "Target Simulator for Fuzzing:",
        choices: Object.values(InjectionType),
      },
    ]);

    const simulator = this.simulators.get(type as InjectionType);
    if (!simulator) return;

    console.log(
      chalk.yellow(`\n[!] Starting Fuzzer against ${type} Simulator...`)
    );
    const spinner = ora("Fuzzing...").start();

    const results = await this.fuzzer.fuzz(simulator);
    spinner.stop();

    if (results.length === 0) {
      console.log(
        chalk.green("No vulnerabilities found with default payloads.")
      );
    } else {
      console.log(
        chalk.red.bold(
          `\n 🔥 CRITICAL: Found ${results.length} vulnerable vectors!`
        )
      );
      results.forEach((r) => {
        console.log(
          chalk.red(`  • Input: "${r.input}" -> ${r.detectedPattern}`)
        );
      });
      await this.askToSave(results);
    }
  }

  private async askToSave(results: SimulationResult[]) {
    const { save } = await inquirer.prompt([
      {
        type: "confirm",
        name: "save",
        message: "Save Report?",
        default: false,
      },
    ]);

    if (save) {
      ReportGenerator.generateJSON(results);
      ReportGenerator.generateMarkdown(results);
      console.log(
        chalk.green("Reports saved to hx-report.json and hx-report.md")
      );
    }
  }
}
