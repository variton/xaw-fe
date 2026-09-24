# Artifact watcher

TypeScript frontend project for Artifact watcher, with tooling for SvelteKit, Svelte, and Vite.

## Project status

The Connect button calls `POST /api/login` with a JSON body containing `username` and `password`. A local mock endpoint validates these against `src/lib/server/fixtures/credentials.json`, with a 500 ms delay to simulate a backend call. Successful login opens the repository workspace; incorrect credentials display an error.

### Mock login

Use username **`demo`** and password **`matrix`**. Edit `src/lib/server/fixtures/credentials.json` to change these demo credentials:

```json
{
  "username": "demo",
  "password": "matrix"
}
```

The fixture is imported only by server code. `mockLogin` in `src/lib/server/mock-auth.ts` performs validation; `src/routes/api/login/+server.ts` returns 200 on success, 401 for incorrect credentials, and 400 for malformed requests. This is a demo login, with no session cookie or authorization; connection state stays in memory and refreshing returns to the login view. To integrate a real backend, replace the mock route or update the endpoint in `src/lib/api/auth.ts`.

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
