# AGENTS.md

## Cursor Cloud specific instructions

aodit is a monorepo with two runnable services plus a database. Standard dev
commands live in `README.md` (`client`: `yarn start`; `server`: `yarn start:watch`).
This section only captures non-obvious, durable setup/run caveats.

### Services

| Service | Dir | Dev command | Port | Notes |
|---|---|---|---|---|
| API server | `server` | `yarn start:watch` | 16000 | Express + ts-node/nodemon. Reads `server/.env`. Connects to MongoDB, creates the `aodit_dev` DB/collections, inits Agenda. Health: `GET /api/health`. |
| Web client | `client` | `yarn start` | 1600 | Vite dev server. Reads `client/.env`. In `REACT_APP_ENV=local` it always calls the API at `http://localhost:16000`. |
| MongoDB | — | see below | 27017 | Required. Not managed by systemd in this VM. |

To run an actual evaluation report you also need an OpenRouter (or OpenAI-compatible)
endpoint: set `OPENROUTER_API_KEY_DEV` in `server/.env`, or point
`OPENROUTER_BASE_URL` at a local server. Everything else (auth, creating agents/reports)
works without it.

### MongoDB

MongoDB 8 is installed but there is no systemd. Start it manually before the server:

```
mongod --dbpath /data/db --bind_ip 127.0.0.1 --port 27017 &
```

Data persists in `/data/db`. The server auto-creates the `aodit_dev` database and its
collections on first connect.

### Env files

`server/.env` and `client/.env` are gitignored and are pre-created in the VM snapshot
with local dev values. If they are missing, copy each `.env.example` and set at least:
`server/.env` → `NODE_ENV=development`, `DEV_PORT=16000`,
`MONGODB_URI_DEV=mongodb://127.0.0.1:27017`, `JWT_SECRET=<any>`, and keep
`http://localhost:1600` in `PUBLIC_URLS_CLIENT_DEV`; `client/.env` → `REACT_APP_ENV=local`,
`REACT_APP_PORT=1600`, `REACT_APP_SERVER_PORT=16000`.

### Shared `@yasserzakywafaa/*` packages (important)

`client` and `server` depend on `@yasserzakywafaa/client-core` and
`@yasserzakywafaa/server-core`, published on GitHub Packages (private; needs
`GITHUB_PACKAGES_TOKEN`). No such token is available in this environment, so the
update script instead builds the sibling repos (`../client-core`, `../server-core`)
and copies their `dist` into `node_modules`. Gotchas:

- Any `yarn` command inside these repos fails with
  `Failed to replace env in config: ${GITHUB_PACKAGES_TOKEN}` unless that variable is
  set to *any* value (the update script uses a dummy). Export/prefix it before running
  yarn there.
- The cores must be a **real copy** (not a symlink) in `node_modules/@yasserzakywafaa/*`,
  otherwise Node/Vite resolve their peer deps (`tslib`, `react`, …) from the wrong place
  and startup fails.
- Do **not** run `yarn install` directly in `client/` or `server/` — it will 401 against
  GitHub Packages and wipe the local core copy. Re-run the update script instead (or set a
  real `GITHUB_PACKAGES_TOKEN` and run `yarn install` normally).

### Lint / test / build

- No ESLint or test scripts are configured in `aodit` itself.
- `server`: `yarn build` runs `tsc` and passes.
- `client`: the build script is `vite build` (no type-check). Running `tsc --noEmit` in
  `client` reports many pre-existing type errors that do **not** affect the dev server or
  `vite build`; don't treat them as a setup regression.
- The sibling `*-core` repos have `yarn test` (vitest).
