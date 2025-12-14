import { IMockFileSystemState } from "../core/context";

export class MockFileSystem {
  private state: IMockFileSystemState;

  constructor() {
    this.state = {
      files: new Map([
        [
          "/etc/passwd",
          "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash",
        ],
        ["/var/www/html/index.html", "<html><h1>Hello World</h1></html>"],
        ["/secret/keys.pem", "BEGIN RSA PRIVATE KEY..."],
      ]),
      accessLog: [],
    };
  }

  public reset() {
    this.state.accessLog = [];
  }

  public getState(): IMockFileSystemState {
    return this.state;
  }

  /**
   * Simulates accessing a file path.
   */
  public readx(path: string): string | null {
    this.state.accessLog.push(`READ ${path}`);
    return this.state.files.get(path) || null;
  }

  public simulateCommandExecution(commandLine: string): string {
    // 1. Detect 'cat /etc/passwd'
    if (commandLine.includes("cat /etc/passwd")) {
      this.readx("/etc/passwd");
      return this.state.files.get("/etc/passwd")!;
    }

    // 2. Detect 'whoami'
    if (commandLine.includes("whoami")) {
      return "root"; // Simulate worst-case scenario
    }

    // 3. Detect 'rm -rf' (Simulated)
    if (commandLine.includes("rm -rf")) {
      return "Simulating deletion of all files... (Destructive)";
    }

    return `Executed: ${commandLine}`;
  }
}
