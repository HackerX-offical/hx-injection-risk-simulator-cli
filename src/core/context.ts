export interface ISandbox {
  reset(): void;
}

export interface IMockUser {
  id: number;
  username: string;
  role: "admin" | "user" | "guest";
}

export interface IMockDatabaseState {
  users: IMockUser[];
  queryLog: string[];
}

export interface IMockFileSystemState {
  files: Map<string, string>; // path -> content
  accessLog: string[];
}

export interface SimulationContext {
  db: IMockDatabaseState;
  fs: IMockFileSystemState;
  env: Record<string, string>;
}
