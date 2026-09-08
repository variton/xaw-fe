# Artifact watcher

TypeScript frontend project for Artifact watcher, with tooling for SvelteKit, Svelte, and Vite.

## Project status

This repository contains a SvelteKit landing page with labeled Login and Password inputs at `/`, plus the SvelteKit, Vite, and TypeScript configuration needed to run it. The Connect button calls `POST /api/login` with a JSON body containing `username` and `password`. Configure the endpoint in `src/lib/api/auth.ts` to match your backend. The current integration assumes the backend establishes a same-origin cookie session and returns a successful HTTP status; after a successful login, it displays a Matrix-style repository workspace at `/` with a top-level Repo dropdown. The dropdown currently shows an empty state; repository data can be supplied through the `repositories` prop of `src/lib/components/ConnectedPage.svelte`. Connection state is held in memory, so refreshing returns to the login view until session restoration is integrated. The backend endpoint is not implemented in this repository. ESLint configuration and tests have not been added yet.

## Requirements

- Node.js 22.13+ within the 22.x release line, or Node.js 24.x, matching the engines required by the locked tooling.
- npm to install dependencies and run scripts.
- A POSIX-compatible shell if using `bootstrap.sh`.

## Setup and development

From the repository root, install the locked dependencies:

```sh
npm ci
```

Start the development server:

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

Build and preview the application:

```sh
npm run build
npm run preview
```

`preview` is for inspecting the build locally. SvelteKit uses `@sveltejs/adapter-auto`; deployment may require an adapter specific to your hosting platform.

## API documentation

`typedoc.json` configures documentation generation with:

- Entry point: `src/lib/index.ts`.
- TypeScript configuration: `tsconfig.json`.
- Output directory: `docs/`.
- Private, protected, and internal members excluded.

TypeDoc is not currently declared in `package.json`, and the entry point is missing. To enable documentation generation, create the entry point and install TypeDoc:

```sh
npm install --save-dev typedoc
npm run docs
```

## Repository layout

```text
.
├── LICENSE            # MIT license
├── package.json       # npm scripts and development dependencies
├── package-lock.json  # Locked dependency versions
├── README.md          # Project documentation
└── typedoc.json       # API documentation settings
```

Dependency declarations currently use `latest`; use `npm ci` to reproduce the versions recorded in the lockfile.

## License

[MIT](LICENSE), copyright © 2026 variton.
