#!/usr/bin/env node
/**
 * holidays-mcp — MCP server for Indian public holidays by state/year.
 *
 * Tools:
 *   holiday_list   — list holidays for a given year and state (or "central").
 *   holiday_search — search holidays by keyword or month.
 *   next_holiday   — the next N upcoming holidays for a state from today.
 *
 * Data source: a self-contained static dataset (lib/holiday.js) covering the
 * three national holidays for 2024/2025 plus a representative set of state
 * holidays for Maharashtra, Karnataka and Tamil Nadu. No network, no API key.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  holidaysFor,
  searchHolidays,
  nextHolidays,
  availableStates,
} from './lib/holiday.js';

const TOOLS = [
  {
    name: 'holiday_list',
    description:
      'List Indian public holidays for a given year and state (or "central" for ' +
      'national holidays). Returns date, day-of-week, name, occasion and type ' +
      '(Central/Federal/State/Gazetted/Optional). Use when a user asks "what ' +
      'holidays are there in 2025 for Maharashtra?" or "central holidays 2024".',
    inputSchema: {
      type: 'object',
      properties: {
        year: {
          type: 'string',
          description: '4-digit year, e.g. "2025".',
        },
        state: {
          type: 'string',
          description:
            'State name or "central". Available: ' + availableStates().join(', ') + '.',
        },
      },
      required: ['year', 'state'],
    },
  },
  {
    name: 'holiday_search',
    description:
      'Search Indian holidays by keyword (e.g. "Diwali", "Republic Day", "Eid") ' +
      'or by month (1-12). Returns matching holidays with date, day-of-week, ' +
      'name, occasion and type. Use when a user asks "when is Diwali in India?" ' +
      'or "holidays in August".',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keyword (name/occasion) or a month number 1-12.',
        },
        state: {
          type: 'string',
          description: 'Optional state filter. Available: ' + availableStates().join(', ') + '.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'next_holiday',
    description:
      'Return the upcoming N holidays (from today) for a given state. Defaults ' +
      'to the next 5. Use when a user asks "what are the next holidays in ' +
      'Tamil Nadu?" or "upcoming central holidays".',
    inputSchema: {
      type: 'object',
      properties: {
        state: {
          type: 'string',
          description: 'State name or "central". Available: ' + availableStates().join(', ') + '.',
        },
        count: {
          type: 'number',
          description: 'How many upcoming holidays to return (default 5).',
        },
      },
      required: ['state'],
    },
  },
];

const server = new Server(
  { name: 'holidays-mcp', version: '0.1.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const wrap = (ok, content) => ({
    content: [{ type: 'text', text: JSON.stringify(content, null, 2) }],
  });

  if (name === 'holiday_list') {
    const year = args?.year;
    const state = args?.state ?? 'central';
    if (!year) {
      return wrap(false, [{ type: 'text', text: 'Missing required argument: year' }]);
    }
    const data = holidaysFor(year, state);
    if (data && data.error) {
      return wrap(false, [{ type: 'text', text: JSON.stringify(data, null, 2) }]);
    }
    return wrap(true, [{ type: 'text', text: JSON.stringify(data, null, 2) }]);
  }

  if (name === 'holiday_search') {
    const query = args?.query;
    const state = args?.state ?? 'central';
    if (!query) {
      return wrap(false, [{ type: 'text', text: 'Missing required argument: query' }]);
    }
    const data = searchHolidays(query, state);
    if (data && data.error) {
      return wrap(false, [{ type: 'text', text: JSON.stringify(data, null, 2) }]);
    }
    return wrap(true, [{ type: 'text', text: JSON.stringify(data, null, 2) }]);
  }

  if (name === 'next_holiday') {
    const state = args?.state ?? 'central';
    const count = args?.count ?? 5;
    if (!state) {
      return wrap(false, [{ type: 'text', text: 'Missing required argument: state' }]);
    }
    const data = nextHolidays(state, count);
    if (data && data.error) {
      return wrap(false, [{ type: 'text', text: JSON.stringify(data, null, 2) }]);
    }
    return wrap(true, [{ type: 'text', text: JSON.stringify(data, null, 2) }]);
  }

  return {
    error: `Unknown tool: ${name}`,
    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('holidays-mcp server running on stdio');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
