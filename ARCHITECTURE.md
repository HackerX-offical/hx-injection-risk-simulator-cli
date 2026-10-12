# hx-injection-risk-simulator-cli architecture

Educational injection-risk simulator for authorized security training. Engines analyze untrusted strings offline; sandboxes and reporters stay injectable so unit tests never need live targets.

## Layout

```
src/
  cli/CLI.ts                 # Commander entry
  core/types.ts, context.ts  # Shared result + mock DB types
  engines/                   # SQL, command, template simulators + PayloadFuzzer
  explainer/ExplainerEngine.ts
  reporting/ReportGenerator.ts
  sandbox/MockDatabase.ts, MockFileSystem.ts
  scenarios/Scenarios.ts
  utils/Tokenizer.ts, ConfigLoader.ts
test/
  *.test.ts                  # Jest unit tests (mocks only)
```

## Data flow

1. CLI loads scenario config → picks `ISimulator` implementation.
2. `analyze(input)` returns `SimulationResult` with risk, pattern, remediation text.
3. `PayloadFuzzer` batches default/custom payloads through a simulator.
4. `MockDatabase.executeQuery` naively models tautology/UNION for SQL demos.
5. `ReportGenerator` writes JSON/Markdown artifacts for engagement notes.

## Develop

```bash
npm install
npm run build
npm test
```

## Deep bar

Targets HackerX `org-standards/verify-deep.sh`: ≥12 non-test `.ts` under `src/`, ≥6 `*.test.ts` / `*.spec.ts` files.

See [SECURITY.md](./SECURITY.md) for authorized use.
