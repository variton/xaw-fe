# xaw-fe

TypeScript frontend project for xaw, with tooling for SvelteKit, Svelte, and Vite.

## Project status

This repository is an initial tooling scaffold. It contains npm scripts, a dependency lockfile, a bootstrap script, and TypeDoc settings. Application source, routes, tests, and the SvelteKit, Vite, TypeScript, and ESLint configuration files have not been added yet. Development, build, and validation scripts require those files before they can be used successfully.

## Requirements

- Node.js 22.13+ within the 22.x release line, or Node.js 24.x, matching the engines required by the locked tooling.
- npm to install dependencies and run scripts.
- A POSIX-compatible shell if using `bootstrap.sh`.

## Setup and development

From the repository root, install the locked dependencies:

```sh
npm ci
```

Once the application source and configuration are in place, start the development server:

```sh
npm run dev
```

Use the local URL printed by Vite to open the application.

Alternatively, run the bootstrap script:

```sh
sh bootstrap.sh
```

The script runs `npm install` when the lockfile is missing, or `npm ci` when the lockfile exists and `node_modules` is absent. It then starts Vite with `--host 0.0.0.0`, making the server listen on all network interfaces. If both the lockfile and `node_modules` already exist, installation is skipped; run `npm ci` yourself when dependencies change.

## Available scripts

| Command                | Purpose                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `npm run dev`          | Start the Vite development server.                                                  |
| `npm run build`        | Create a production build.                                                          |
| `npm run preview`      | Preview a production build locally.                                                 |
| `npm run check`        | Generate SvelteKit metadata and run Svelte/TypeScript checks using `tsconfig.json`. |
| `npm run lint`         | Run ESLint across the repository.                                                   |
| `npm run lint:fix`     | Run ESLint and apply automatic fixes.                                               |
| `npm run format`       | Format files with Prettier.                                                         |
| `npm run format:check` | Check formatting without modifying files.                                           |
| `npm test`             | Run Vitest, using watch mode in an interactive development environment.             |
| `npm run test:run`     | Run Vitest once.                                                                    |
| `npm run docs`         | Generate API documentation with TypeDoc; see prerequisites below.                   |

## Build and preview

After completing the application scaffold:

```sh
npm run build
npm run preview
```

`preview` is for inspecting the build locally. Deployment configuration is not included. `@sveltejs/adapter-auto` is declared as a development dependency, but a SvelteKit configuration must be added to select and configure an adapter.

## API documentation

`typedoc.json` configures documentation generation with:

- Entry point: `src/lib/index.ts`.
- TypeScript configuration: `tsconfig.json`.
- Output directory: `docs/`.
- Private, protected, and internal members excluded.

TypeDoc is not currently declared in `package.json`, and the entry point and TypeScript configuration are missing. To enable documentation generation, create those files and install TypeDoc:

```sh
npm install --save-dev typedoc
npm run docs
```

## Repository layout

```text
.
├── bootstrap.sh       # Install dependencies if needed and start Vite
├── LICENSE            # MIT license
├── package.json       # npm scripts and development dependencies
├── package-lock.json  # Locked dependency versions
├── README.md          # Project documentation
└── typedoc.json       # API documentation settings
```

Dependency declarations currently use `latest`; use `npm ci` to reproduce the versions recorded in the lockfile.

## License

[MIT](LICENSE), copyright © 2026 variton.
