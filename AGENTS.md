# JE MCP Router — agent memory

## Do not install NemoClaw unless asked

The user may paste NVIDIA NemoClaw onboarding instructions for architecture/design context. **Do not install NemoClaw, OpenShell, Docker models, or run onboarders unless they explicitly ask.** Prefer documenting and wiring JE MCP Router around that stack.

## Ideal enterprise architecture (target)

**OpenShell gateway is hosted centrally on the VM (remote), not on each user’s laptop.**  
Users only attach a light CLI / channel to that remote gateway. Multiple sandboxes run on the central compute. IT controls network approval on the OpenShell dashboard. JE MCP Router is the separate MCP tool plane (same Azure estate or adjacent).

Official OpenShell supports this: register a remote gateway with  
`openshell gateway add http://HOST:PORT --remote`, and choose a compute driver:

| Driver | Where sandboxes run | Fit for JE |
|---|---|---|
| **Docker** | Containers **on the gateway host (the VM)** | Good for one central VM, multi-sandbox |
| **Kubernetes** | Pods in a cluster | Better long-term shared cloud |
| Podman / MicroVM | Host / VM-backed | Alternate isolation |

```text
┌─ User devices (no OpenShell host, no JE gateway) ────────┐
│  Thin client: nemoclaw/openshell CLI → --remote gateway  │
│  or messaging channel into a sandbox                     │
└───────────────────────────┬──────────────────────────────┘
                            │ control plane / attach
                            ▼
┌─ Central Azure VM (IT-controlled) ───────────────────────┐
│  OpenShell gateway  ← central control plane              │
│    • multi sandbox A/B/N (Docker on this host, or K8s)   │
│    • L7 egress + credential injection                    │
│    • IT dashboard: approve / deny network requests       │
│                                                          │
│  JE MCP Router (Electron or service)  ← MCP tool plane   │
│    HTTP /mcp + IT-issued tokens (not end-user)           │
│    Excel / PPT MCP servers                               │
│                                                          │
│  Sandbox egress → (only if IT approved) → JE /mcp        │
└──────────────────────────────────────────────────────────┘
```

### Design rules

1. **OpenShell on the VM** — central remote gateway; users do not install/run the OpenShell host locally.
2. **Multi-sandbox on that plane** — many agent sandboxes via Docker-on-VM (near term) or Kubernetes (scale).
3. **No user access to JE MCP** — tokens/URL injected by OpenShell at the boundary; users never open JE Settings / Client setup.
4. **IT network approval** — OpenShell dashboard approve/deny egress (including MCP to JE).
5. **Two gateways stay distinct** — OpenShell (sandbox + network) ≠ JE MCP Router (MCP aggregation); both can live in the same Azure estate.

### Platform caveat (important)

- OpenShell/NemoClaw expect **Linux + Docker** (or WSL2 / Linux VM), not a bare Windows desktop host.
- Today’s JE Azure box is **Windows** for Excel/PPT Electron. Realistic options:
  - **A)** Linux VM (or AKS) for OpenShell + keep Windows VM for JE MCP / Office MCPs  
  - **B)** Same Windows host via **WSL2 + Docker** for OpenShell (possible, ops-heavier)  
  - **C)** Longer term: Kubernetes driver for OpenShell; Windows node/VM only for Office tools  
- Do not claim “drop OpenShell onto the current Windows JE Electron VM” is the supported first-class path without WSL/Linux.

### What is possible vs not yet built in this fork

| Goal | Possible? |
|---|---|
| Host OpenShell gateway remotely / centrally | **Yes** (NVIDIA: remote gateway + Docker/K8s drivers) |
| IT approve/deny sandbox network via OpenShell dashboard | **Yes** (OpenShell/NemoClaw plane — not JE UI) |
| JE MCP Router remote on Azure | **Yes** (already in this fork) |
| Users never see JE tokens | **Design target** — needs OpenShell credential injection + hide Client setup from end users |
| Same single Windows VM running both without WSL | **Fragile / not preferred** |

When implementing features, prefer: remote OpenShell, IT-only JE admin, injected MCP credentials, audit of tool calls.

## Current product wiring (interim)

| Layer | Role | Where |
|---|---|---|
| OpenShell gateway | Sandbox lifecycle, egress policy, credential injection at boundary | Agent hosts (many) |
| JE MCP Router | MCP aggregator `/mcp` + Bearer | Central Azure Windows VM |
| Hermes YAML | `url` + `Authorization: Bearer` (no `@mcp_router/cli` for Azure) | Injected into sandbox / host config by IT — not a user DIY step in the ideal end state |

- Local dir: `/Users/meghamshbalantrapu/Desktop/mcp-router-je`
- Branch: `je/hermes-branding`
- Remote: `https://github.com/meghamshb2006/mcprouter`
- Deploy notes: `docs/JE_AZURE_HERMES.md`

### Settings (IT-operated gateway host)

- `mcpRemoteAccessEnabled` → bind `0.0.0.0`
- `mcpHttpPort` (default `3282`)
- `mcpGatewayPublicUrl` → e.g. `http://intern.eastasia.cloudapp.azure.com:3282/mcp`

## NemoClaw instruction snapshot (reference only)

When helping with NemoClaw later (only if asked): follow NVIDIA’s non-technical install prompt rules — one question at a time, credential helper digests pinned, no secrets in chat, platform assets only for DGX Spark / DGX Station / Windows WSL. This Mac was detected as ordinary macOS Apple Silicon; no DGX/WSL platform asset applies unless re-checked.
