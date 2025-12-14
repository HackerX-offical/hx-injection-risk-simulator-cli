import { InjectionType } from "../core/types";

export interface Scenario {
  name: string;
  type: InjectionType;
  description: string;
  unsafeInput: string;
  safeInput: string;
}

export const Scenarios: Scenario[] = [
  {
    name: "Login Bypass",
    type: InjectionType.SQL,
    description: "Attempting to bypass authentication using a tautology.",
    unsafeInput: "' OR '1'='1",
    safeInput: "admin",
  },
  {
    name: "UNION Select",
    type: InjectionType.SQL,
    description: "Extracting data from other tables.",
    unsafeInput: "' UNION SELECT username, password FROM users --",
    safeInput: "standard_user",
  },
  {
    name: "File Read",
    type: InjectionType.COMMAND,
    description: "Reading sensitive system files via command chaining.",
    unsafeInput: "; cat /etc/passwd",
    safeInput: "127.0.0.1",
  },
  {
    name: "RCE via Pipe",
    type: InjectionType.COMMAND,
    description: "Executing arbitrary commands using a pipe.",
    unsafeInput: "| whoami",
    safeInput: "google.com",
  },
  {
    name: "Calculation",
    type: InjectionType.TEMPLATE,
    description: "Executing math to prove code execution.",
    unsafeInput: "{{7*7}}",
    safeInput: "Just text",
  },
  {
    name: "Environment Variable",
    type: InjectionType.TEMPLATE,
    description: "Accessing environment variables.",
    unsafeInput: "${env.SECRET}",
    safeInput: "Guest",
  },
];
