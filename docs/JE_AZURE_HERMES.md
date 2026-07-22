# JE MCP Router — Azure + Hermes (end-to-end)

This guide wires **JE MCP Router** (mcp-router) as the centralized MCP aggregator for **Hermes / NemoHermes** on an Azure Windows VM (for example `intern.eastasia.cloudapp.azure.com`).

## Architecture

```text
Cursor / Claude (local) ──stdio──► npx @mcp_router/cli connect ──► 127.0.0.1:3282/mcp
                                                                    │
Hermes (same or remote host) ──stdio──► cli connect --url PUBLIC_URL ┘
                                                                    │
                                                         JE MCP Router (Electron)
                                                         Aggregates configured MCP servers
```

- Local clients (Cursor, Claude, VS Code) keep using `localhost:3282`.
- Hermes uses the **public gateway URL** when configured in Settings → Remote MCP Access.
- Auth: Bearer token (`MCPR_TOKEN`) issued by JE MCP Router (Apps → Hermes → Add MCP Config).

## One-time VM setup (Windows)

```powershell
# Node 20 LTS + Git, then:
corepack enable
corepack prepare pnpm@10.22.0 --activate

cd C:\Users\azureuser
git clone https://github.com/meghamshb2006/mcpcontrol.git mcp-router-je
cd mcp-router-je
git checkout je/hermes-branding
pnpm install
```

Electron needs a desktop session (RDP). Then:

```powershell
pnpm --filter @mcp_router/electron dev
```

## Enable remote access (in the app)

1. Open **Settings → Remote MCP Access (JE / Azure)**.
2. Enable **Allow remote MCP clients**.
3. Bind host `0.0.0.0`, port `3282` (or your choice).
4. Set **Public gateway URL**, e.g.  
   `https://intern.eastasia.cloudapp.azure.com:3282/mcp`  
   (use `http://` if TLS is not terminated yet).
5. Save → **restart the app**.
6. Open **Apps → Hermes → Add MCP Config** (rewrites `~/.hermes/config.yaml` with `--url` + token).

## Azure networking

- NSG / firewall: allow inbound TCP on the MCP port (default **3282**) from Hermes clients only.
- Prefer private VNet / VPN; if public, treat the token as a secret and rotate it.

## Env overrides (optional)

| Variable | Purpose |
|---|---|
| `MCPR_HTTP_HOST` | Bind host (overrides settings) |
| `MCPR_HTTP_PORT` | Bind port |
| `MCPR_GATEWAY_PUBLIC_URL` | Public URL written into Hermes YAML |
| `MCPR_URL` | CLI connect default base URL |
| `MCPR_TOKEN` | Bearer token (required by clients) |

## Smoke checks

```powershell
# Liveness (no auth)
Invoke-RestMethod http://127.0.0.1:3282/health

# Authenticated status
$headers = @{ Authorization = "Bearer $env:MCPR_TOKEN" }
Invoke-RestMethod http://127.0.0.1:3282/mcp/status -Headers $headers

# From another host (replace host)
Invoke-RestMethod http://intern.eastasia.cloudapp.azure.com:3282/health
```

Or run `scripts/smoke-je-gateway.ps1`.

## Hermes config shape

After **Add MCP Config**, `~/.hermes/config.yaml` should contain something like:

```yaml
mcp_servers:
  mcp-router:
    command: "npx"
    args: ["-y", "@mcp_router/cli@latest", "connect", "--url", "http://HOST:3282/mcp"]
    env:
      MCPR_TOKEN: "<token from JE MCP Router>"
      MCPR_URL: "http://HOST:3282/mcp"
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| `pnpm` not recognized | `corepack enable` then `corepack prepare pnpm@10.22.0 --activate` |
| Health works on VM but not remotely | Open NSG + Windows Firewall for the port; confirm remote access enabled + restart |
| Hermes tools empty | Re-run Apps → Hermes → Add MCP Config; confirm token and servers are enabled |
| Electron won't start | Need RDP interactive session; headless servers cannot show the UI |
