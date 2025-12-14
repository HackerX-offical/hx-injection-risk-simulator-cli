import fs from "fs";
import path from "path";

export interface HXConfig {
  fuzzer: {
    customPayloads: string[];
    enableDefaultPayloads: boolean;
  };
  reporting: {
    format: "json" | "markdown" | "both";
    outputDir: string;
  };
}

export class ConfigLoader {
  private static configPath = path.resolve("hx-config.json");

  public static load(): HXConfig {
    const defaultConfig: HXConfig = {
      fuzzer: {
        customPayloads: [],
        enableDefaultPayloads: true,
      },
      reporting: {
        format: "both",
        outputDir: "./",
      },
    };

    if (fs.existsSync(this.configPath)) {
      try {
        const raw = fs.readFileSync(this.configPath, "utf-8");
        const userConfig = JSON.parse(raw);
        return { ...defaultConfig, ...userConfig };
      } catch (e) {
        console.warn("Failed to parse hx-config.json, using defaults.");
      }
    }

    return defaultConfig;
  }
}
