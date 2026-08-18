# Belnet GUI

A cross-platform desktop control panel for [belnet](https://github.com/Beldex-Coin/belnet), the Beldex decentralized VPN. The GUI starts/stops the locally running belnet daemon, lets you pick an exit node, and shows live connection stats. It does not carry VPN traffic itself — all routing happens in the belnet daemon.

## Features

- One-click connect/disconnect with exit node selection
- Latency-aware exit node list: nodes are probed from your machine, sorted by measured latency (color-coded ms badges), and the fastest reachable node is auto-selected
- Live speed chart, router/path stats, and application logs
- System tray integration and auto-updates

## How it works

```
React renderer (src/) ── IPC ──> Electron main process ── ZeroMQ (tcp://127.0.0.1:1190) ──> belnet daemon
```

The renderer polls the daemon status (`llarp.get_status`) every 2 seconds through an IPC → ZeroMQ bridge. Exit nodes are applied via `llarp.exit`. The ZMQ link self-heals with exponential backoff if the daemon restarts.

## Requirements

- Node 16.13.0 (see `.nvmrc` — use [nvm](https://github.com/nvm-sh/nvm) or [asdf](https://github.com/asdf-vm/asdf))
- yarn
- git
- wine (only for Windows builds from Linux)
- a local belnet daemon (the GUI can start/stop it for you)

## Development

```bash
git clone https://github.com/Beldex-Coin/belnet-gui
cd belnet-gui
yarn install --frozen-lockfile
yarn dev          # dev build with hot reload (renderer on port 4000)
```

Useful scripts:

| Command | Purpose |
|---|---|
| `yarn dev` | Run the app in development mode |
| `yarn compile` | Production compile of main + renderer bundles |
| `yarn lint` / `yarn format` | Lint / format the codebase |
| `yarn dist` | Clean production build |
| `yarn appImage` / `yarn deb` / `yarn win32` | Platform packages |

Production bundles are minified with no source maps; dev builds keep source maps and hot reload.

## Environment variables

- `DISABLE_AUTO_START_STOP=anything` — don't auto start/stop the belnet daemon when the GUI starts/quits.

## Project layout

```
main.ts                     Electron main process entry, window + auto-updater
belnetRpcCall.ts            ZeroMQ dealer to the daemon RPC (self-healing loop)
belnetProcessManager*.ts    Start/stop the daemon per platform (systemd, macOS, Windows)
ipcNode.ts / sharedIpc.ts   IPC bridge between renderer and main process
utilityIPCCalls.ts          Utility IPC calls incl. exit-node latency probing
src/app/                    React UI (components, theme, store)
src/features/               Redux slices (status, exit node, logs, UI)
src/ipc/ipcRenderer.ts      Renderer-side IPC channels and status parsing
```

## CI builds

Builds from CI can be obtained from our [ci server](https://deb.beldex.io).

## License

GPL-3.0 © Beldex International
