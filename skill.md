---
name: holidays-mcp
version: 0.1.0
description: MCP server for Indian public holidays by state/year. Lists central and state holidays, searches by keyword or month, and returns upcoming holidays.
author: King-AAA2012
license: MIT
---

# holidays-mcp â€” Skill

A single MCP (Model Context Protocol) server for Indian data. It lets Claude
Desktop, Claude Code, Cline, or any other MCP client call tools backed by real
Indian data.


## Requirements
- **Node.js 18+
No API key is required.

## How to Install / Run

```bash
npm install
node server.js      # boots the MCP server over stdio
```

### Register with an MCP client

Add a server entry to your MCP client config JSON:

```json
{
  "mcpServers": {
    "holidays-mcp": {
      "command": "node",
      "args": ["C:/Users/Aditya Shah/Desktop/Code/holidays-mcp/server.js"]
    }
  }
}
```

## How to Verify (Tests)

```bash
npm test
```

## Selling / Redistributing

This skill is provided under MIT, so it may be sold or redistributed. Ship it
as its own zip (holidays-mcp-0.1.0.zip) in the packages/ folder alongside the other
india-mcp packages.

