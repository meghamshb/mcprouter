# MCP Router

> One place to connect MCP tools to the agents that need them.

MCP Router is a desktop app for managing MCP servers and exposing their tools through a single gateway. Instead of configuring every agent separately for every server, you manage servers in one interface, decide which tools a client can use, and connect the client to the router.

This repository is a **modified fork** of the original [MCP Router](https://github.com/mcp-router/mcp-router). It adds a remote HTTP gateway and a Hermes-oriented client flow. The application still carries organization-specific branding; this is a project fork, not a neutral upstream release.

## The idea

An MCP server gives an AI client a set of tools. As the number of servers and clients grows, connection details, access tokens, and tool visibility become harder to manage. MCP Router sits in the middle:

**MCP servers → router and access controls → one client connection**

The desktop app provides a visual place to register and inspect servers. The gateway exposes an MCP endpoint to clients, with bearer tokens and per-server access checks. A small CLI can bridge between stdio-based clients and an HTTP endpoint when needed.

## What this fork explores

- **Remote access:** bind the gateway for a client on another machine, instead of only serving the local desktop.
- **Client authorization:** use bearer tokens and server-level access checks at the gateway.
- **Agent integration:** connect Hermes directly to the HTTP MCP endpoint using its native URL and authorization settings.
- **Desktop administration:** keep server setup and gateway settings in the app rather than in a collection of hand-edited client configs.

These are pieces of an integration, not a promise that the router by itself secures an agent sandbox or its network egress. If you expose the endpoint beyond your machine, put it behind appropriate TLS and network controls, issue scoped tokens, and review the deployment environment.

## Try the desktop app

You'll need Node.js 20+ and pnpm (the repository pins pnpm 10.22.0). From a checkout:

```bash
pnpm install
pnpm --filter @mcp_router/electron dev
```

Start by adding an MCP server in the desktop app. The [CLI guide](apps/cli/README.md) explains the stdio ↔ HTTP bridge for clients that need it. A remote gateway also needs an access token, TLS termination, and appropriate network controls before it is exposed beyond a local test.

## Provenance and license

This is a modified fork, with upstream attribution retained. Review [LICENSE.md](LICENSE.md) and the upstream project's notices before reusing or distributing it; this repository is **not** MIT-licensed.
