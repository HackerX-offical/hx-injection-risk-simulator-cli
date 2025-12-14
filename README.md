# HX Injection Risk Simulator CLI

> The advanced educational tool for simulating and analyzing injection risks in a secure, sandboxed environment.

**Author**: SURYANSHU NABHEET  
**Organization**: HackerX  
**Version**: 1.0.0

## 🚀 Key Features

### 🛡️ Core Simulation Engine

- **Mock Sandbox Environment**: Simulates a virtual Database and FileSystem to analyze the _actual impact_ of injections (e.g., Logic Bypass detection).
- **Context-Aware Analysis**: Uses basic tokenization and heuristics (not just regex) to identify complex threats.

### 🔬 Advanced Analysis Modules

- **Payload Fuzzer**: Automated module that tests simulators against a library of known attack vectors to find weaknesses.
- **Explainer Engine**: Generates professional, deep-dive technical reports with ASCII art and remediation guides.
- **Report Generator**: Exports findings to JSON and Markdown for compliance and review.

### 🎮 Enterprise CLI

- **Rich UI**: Interactive menus, loading spinners, and color-coded alerts using `ora`, `detect`, and `chalk`.
- **Configuration**: Customizable via `hx-config.json`.

## 📦 Installation

```bash
git clone https://github.com/HackerX-offical/hx-injection-risk-simulator-cli.git
cd hx-injection-risk-simulator-cli
npm install
npm run build
```

## 🛠️ Usage

### Interactive Mode

Launch the main menu:

```bash
npm start
```

### Modes

1. **Interactive Simulation**: Manually input strings to test specific simulators (SQL, Command, Template).
2. **Educational Scenarios**: Walk through pre-defined safe/unsafe examples to learn the difference.
3. **Auto-Fuzzing**: Automatically run a battery of tests against a selected simulator to discover potential vulnerabilities.

## ⚙️ Configuration

Create a `hx-config.json` in the root directory to customize behaviors:

```json
{
  "fuzzer": {
    "customPayloads": ["' OR 1=1 --", "; id"],
    "enableDefaultPayloads": true
  },
  "reporting": {
    "format": "both"
  }
}
```

## 🧪 Testing

Run the comprehensive unit test suite:

```bash
npm test
```

## 🛡️ Ethics & Security

This tool is for **educational use only**. It uses mock logic and does not interact with real systems. Do not use these payloads against targets you do not own.

## 📄 License

MIT License.
