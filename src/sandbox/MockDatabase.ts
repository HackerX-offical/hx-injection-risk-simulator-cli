import { IMockDatabaseState, IMockUser } from "../core/context";

export class MockDatabase {
  private state: IMockDatabaseState;

  constructor() {
    this.state = {
      users: [
        { id: 1, username: "admin", role: "admin" },
        { id: 2, username: "alice", role: "user" },
        { id: 3, username: "bob", role: "user" },
        { id: 4, username: "guest", role: "guest" },
      ],
      queryLog: [],
    };
  }

  public reset() {
    this.state.queryLog = [];
  }

  public getState(): IMockDatabaseState {
    return this.state;
  }

  /**
   * Simulates executing a query.
   * NOTE: This is a simplifed parser for educational purposes.
   * It relies on regex to "interpret" the SQL meaning in a very naive way suitable for the simulation.
   */
  public executeQuery(query: string): IMockUser[] {
    this.state.queryLog.push(query);

    // 1. Detect Tautology (OR '1'='1')
    // If the query contains a tautology, we simulate returning ALL users (Logic Bypass)
    const tautologyRegex = /OR\s+['"]?1['"]?\s*=\s*['"]?1['"]?/i;
    if (tautologyRegex.test(query)) {
      return this.state.users;
    }

    // 2. Detect UNION-based exfiltration
    // If UNION is detected, we simulate returning data + some "leaked" extra rows
    if (/UNION\s+SELECT/i.test(query)) {
      // In a real scenario this would return mismatched columns, but for sim we just return standard users
      return [...this.state.users];
    }

    // 3. Normal Authentication Simulation (WHERE username = '...')
    // Extract the username value
    const match = query.match(/username\s*=\s*'([^']*)'/i);
    if (match && match[1]) {
      const username = match[1];
      const user = this.state.users.find((u) => u.username === username);
      return user ? [user] : [];
    }

    // Default: Return nothing if basic parsing fails or no match
    return [];
  }
}
