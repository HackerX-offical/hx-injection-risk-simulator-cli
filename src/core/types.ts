export enum InjectionType {
  SQL = "SQL",
  COMMAND = "COMMAND",
  TEMPLATE = "TEMPLATE",
}

export enum RiskLevel {
  SAFE = "SAFE",
  LOW = "LOW", // Might be risky in some contexts or bad practice, but not directly exploitable
  HIGH = "HIGH", // Directly exploitable or clearly dangerous pattern
}

export interface SimulationResult {
  type: InjectionType;
  riskLevel: RiskLevel;
  input: string;
  detectedPattern?: string; // The regex or pattern that matched
  exploitationPotential?: string; // Description of what could happen
  preventionMeasure: string; // Brief on how to fix
  explanation: string; // Detailed educational explanation
}

export interface ISimulator {
  type: InjectionType;
  analyze(input: string): Promise<SimulationResult>;
  explain(result: SimulationResult): string;
}
