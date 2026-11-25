# holidays-mcp

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server for **Indian public holidays by state/year**. It lets Claude Code, Claude Desktop, Cline, and any other MCP client list central and state holidays, search them by keyword or month, and get the upcoming holidays for a state from today.

Indian public holidays fall into two buckets: the three **national** holidays — Republic Day, Independence Day, and Gandhi Jayanti — plus a large set of **state** holidays (gazetted public holidays and optional ones) that vary by state. This server ships a small, self-contained static dataset covering the national holidays for 2024/2025 plus a representative set of state holidays for Maharashtra, Karnataka and Tamil Nadu (including regional festivals such as Ganeshotsav, Pongal and Ugadi).

## What it does

Three tools:

- **`holiday_list`** — lists holidays for a given year and state (or `central` for national holidays). Returns date, day-of-week, name, occasion and type (Central/Federal/State/Gazetted/Optional).
- **`holiday_search`** — searches holidays by keyword (e.g. `Diwali`, `Republic Day`, `Eid`) or by month (1–12).
- **`next_holiday`** — returns the upcoming `N` holidays (from today) for a state (defaults to 5).

## Quick start

Requires **Node.js 18+**. No API key is needed — the data is bundled with the package.

```bash
# from the monorepo root
npm install          # installs @modelcontextprotocol/sdk
npm run test --workspace holidays-mcp   # run the tests
```

Run the server directly (stdio transport):

```bash
node server.js
```

## MCP client configuration

Add it to your MCP client's configuration as a stdio server:

```json
{
  "mcpServers": {
    "holidays": {
      "command": "node",
      "args": ["/absolute/path/to/india-mcp/holidays-mcp/server.js"]
    }
  }
}
```

Or, from inside the package folder:

```json
{
  "mcpServers": {
    "holidays": {
      "command": "node",
      "args": ["server.js"]
    }
  }
}
```

## Tool examples

**`holiday_list`** — arguments:

| argument | type | required | description |
| --- | --- | --- | --- |
| `year` | string | yes | 4-digit year, e.g. `2025` |
| `state` | string | yes | State name or `central`. Available: `central`, `Maharashtra`, `Karnataka`, `Tamil Nadu` |

Example call:

```json
{ "name": "holiday_list", "arguments": { "year": "2025", "state": "Maharashtra" } }
```

Example response (trimmed):

```json
{
  "ok": true,
  "data": [
    {
      "date": "2025-01-26",
      "dayOfWeek": "Sunday",
      "name": "Republic Day",
      "occasion": "National",
      "type": "Central"
    },
    {
      "date": "2025-05-01",
      "dayOfWeek": "Thursday",
      "name": "Maharashtra Day",
      "occasion": "State Formation",
      "type": "Gazetted"
    }
  ]
}
```

**`holiday_search`** — arguments:

| argument | type | required | description |
| --- | --- | --- | --- |
| `query` | string | yes | Keyword (name/occasion) or a month number 1–12 |
| `state` | string | no | Optional state filter |

Example call — find Diwali in 2025:

```json
{ "name": "holiday_search", "arguments": { "query": "Diwali", "state": "central" } }
```

Example call — all central holidays in August:

```json
{ "name": "holiday_search", "arguments": { "query": "8", "state": "central" } }
```

**`next_holiday`** — arguments:

| argument | type | required | description |
| --- | --- | --- | --- |
| `state` | string | yes | State name or `central` |
| `count` | number | no | How many upcoming holidays to return (default 5) |

Example call:

```json
{ "name": "next_holiday", "arguments": { "state": "Tamil Nadu", "count": 5 } }
```

## Data source

The data is a **self-contained static dataset** bundled in `lib/holiday.js`. It is not fetched from a network API — there is no API key and no runtime dependency on any external service. The dataset includes:

- **Central (national) holidays** for 2024 and 2025: Republic Day, Holi, Id-ul-Fitr, Maharashtra Day, Independence Day, Gandhi Jayanti, Diwali, Christmas, Mahashivratri, Janmashtami, Children's Day.
- **State holidays** for `Maharashtra` (Ganeshotsav, Maharashtra Day, Dr. Ambedkar Jayanti), `Karnataka` (Ugadi, Karnataka Rajyotsava, Mysuru Dasara) and `Tamil Nadu` (Pongal, Tamil New Year).

This is realistic sample data for local development and testing. It is not a complete or authoritative holiday calendar — for production use, pair it against an official source such as the Central Government Gazette or [data.gov.in](https://www.data.gov.in).

## Scripts

| script | description |
| --- | --- |
| `npm start` | run the server (`node server.js`) |
| `npm run dev` | run the server (`node server.js`) |
| `npm test` | run the tests (`node scripts/test.mjs`) |

## License

[MIT](./LICENSE)
