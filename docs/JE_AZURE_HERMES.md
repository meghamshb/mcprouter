# JE MCP Router — Azure + Hermes (end-to-end)

This guide wires **JE MCP Router** as the centralized MCP aggregator for **Hermes / NemoHermes**. Excel/PPT MCP servers run on an Azure Windows VM; Hermes on a Mac (or elsewhere) connects over HTTP with a Bearer token.

## Architecture

```text
Hermes / NemoHermes (Mac)
  HTTP POST + Authorization: Bearer <token>
       │
       ▼
  http://<azure-host>:3282/mcp
       │
       ▼
JE MCP Router (Electron on Azure Windows VM)
  Aggregates configured MCP servers (Excel, PPT, …)
```

- Auth: Bearer token issued by JE MCP Router (**Apps → Hermes → Add MCP config** or **Client setup**).
- Hermes uses **native HTTP MCP** (`url` + `headers.Authorization`). Do **not** use `@mcp_router/cli` for Azure (npm 0.2.0 ignores `--url`).
- Local Cursor/Claude on the same machine can still use localhost if desired.

## Deploy on a small Azure VM (4 GB) — recommended

Do **not** run `pnpm dev` on a 4 GB VM (webpack OOMs). Build the Windows installer in GitHub Actions, then install/run the packaged app on the VM.

### 1) Build on GitHub Actions

Repo: https://github.com/meghamshb2006/mcprouter  

Workflow: **Windows Azure Package** (`.github/workflows/windows-azure-package.yml`)

- Runs on push to `main` / `je/hermes-branding`, or manually via **Actions → Windows Azure Package → Run workflow**
- Artifact name: `je-mcp-router-windows-x64`

### 2) Download onto the Azure VM (RDP)

In the GitHub run → **Artifacts** → download `je-mcp-router-windows-x64` → copy ZIP to the VM → extract.

```powershell
gh run download --repo meghamshb2006/mcprouter -n je-mcp-router-windows-x64 -D C:\Users\azureuser\je-mcp-router-build
```

### 3) Install / run

- Prefer the **Squirrel Setup `.exe`** if present → install → launch **JE MCP Router**
- Electron needs an interactive RDP desktop session while the gateway is running

## Enable enterprise gateway (in the app)

1. Open **Settings → JE Enterprise Gateway**.
2. Enable **Enable enterprise gateway**.
3. Listen address `0.0.0.0`, service port `3282` (or your choice).
4. Set **Client endpoint URL**, e.g.  
   `http://intern.eastasia.cloudapp.azure.com:3282/mcp`  
   (use `https://` only if TLS is terminated in front of the app).
5. **Save** → **Restart now**.
6. Add Excel (and later PPT) MCP servers; power them **LIVE**.
7. Open **Apps → Hermes → Add MCP config** (writes HTTP YAML + token into `~/.hermes/config.yaml` on the machine where Hermes lives — usually the Mac).  
   If Hermes is on the Mac, copy the Client setup YAML there, or run Add MCP config on the Mac with the same token flow.

> Note: **Add MCP config** on the Azure VM writes `C:\Users\…\.hermes\config.yaml` on the VM. For Mac Hermes, use **Client setup** and paste into `~/.hermes/config.yaml` on the Mac, or create the token on the VM and paste the snippet onto the Mac.

## Azure networking

- NSG / Windows Firewall: allow inbound TCP on the MCP port (default **3282**) from Hermes clients only.
- Prefer private VNet / VPN; if public, treat the token as a secret and rotate it.

## Env overrides (optional)

| Variable | Purpose |
|---|---|
| `MCPR_HTTP_HOST` | Bind host (overrides settings) |
| `MCPR_HTTP_PORT` | Bind port |
| `MCPR_GATEWAY_PUBLIC_URL` | Public URL written into Hermes YAML |

## Smoke checks

```powershell
# Liveness (no auth)
Invoke-RestMethod http://127.0.0.1:3282/health

# Authenticated status
$headers = @{ Authorization = "Bearer $env:MCPR_TOKEN" }
Invoke-RestMethod http://127.0.0.1:3282/mcp/status -Headers $headers

# From another host
Invoke-RestMethod http://intern.eastasia.cloudapp.azure.com:3282/health
```

Or run `scripts/smoke-je-gateway.ps1`.

## Hermes config shape (canonical)

After **Add MCP config** / **Client setup**, `~/.hermes/config.yaml` should contain:

```yaml
mcp_servers:
  mcp-router:
    url: "http://HOST:3282/mcp"
    headers:
      Authorization: "Bearer <token from JE MCP Router>"
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| Health works on VM but not remotely | Open NSG + Windows Firewall; confirm enterprise gateway enabled + restart |
| Hermes tools empty | Re-issue token; enable Excel on Server access; confirm LIVE; paste HTTP YAML on Mac |
| Token not found | Create a fresh token after reinstall |
| Electron won't start | Need RDP interactive session |
| Connection refused | App still bound to `127.0.0.1` — enable gateway, set `0.0.0.0`, restart |
