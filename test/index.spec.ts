import { describe, it, expect } from 'vitest';
import { createMcpServer } from '../src/index.js';
import { tools } from '../src/mcp/toolRegistry.js';

// Ensure required env vars for tests
process.env.HULIHEALTH_API_KEY = 'test';
process.env.HULI_ORG_ID = 'org';

describe('MCP server', () => {
  it('registers all tools', () => {
    const server = createMcpServer() as any;
    const registered = Object.keys(server._registeredTools);
    const expected = tools.map((t) => t.name);
    expect(registered.sort()).toEqual(expected.sort());
  });

  // The HTTP server has been removed in favor of pure MCP transports.
});
