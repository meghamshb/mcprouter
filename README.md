# MCP Router

One MCP server is easy to wire up. A growing collection of servers, clients, and tokens is less fun.

MCP Router gives those connections a home: manage servers in a desktop app, expose their tools through one gateway, and decide which servers each client can reach. This fork adds a remote HTTP endpoint and a Hermes-friendly connection flow, so an agent doesn't need a separate hand-written config for every tool server.

The interesting bit is the boundary. The router knows about servers and access tokens; the agent only needs its authorized MCP connection. A small CLI bridges stdio and HTTP for clients that need it.

This is a **modified fork** of the original [MCP Router](https://github.com/mcp-router/mcp-router), not an upstream release. The app retains organization-specific branding. A remote gateway also needs TLS and network controls; a token alone is not a deployment plan.

Want to run it? Use Node.js 20+ and pnpm, then `pnpm install` and `pnpm --filter @mcp_router/electron dev`.

[CLI guide ↗](apps/cli/README.md) · [license and upstream notices ↗](LICENSE.md)
