# hx-injection-risk-simulator-cli

Offline injection pattern simulator for SQL, NoSQL, and template contexts.

## Why this exists

Developers learn parser boundaries by seeing tokenized payloads locally — not by hitting
production apps.

## Features

- Tokenizer and scenario modules with Jest tests
- Winston logging and CLI tables
- No live HTTP in unit tests

## Install

```bash
git clone https://github.com/HackerX-offical/hx-injection-risk-simulator-cli.git
cd hx-injection-risk-simulator-cli
npm install && npm run build
```

## Quick start

```bash
npm run dev
```

## Output

Risk tables and explanations on stdout.

## Develop

```bash
npm test
npm run format:check
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for module layout and extension points.

## Ethics

Use only on systems and content you are **authorized** to test. See
[SECURITY.md](./SECURITY.md).

## License

Licensed under the [HackerX License](./LICENSE). Redistributions must retain copyright,
license text, and [NOTICE](./NOTICE) attribution per the license terms.
