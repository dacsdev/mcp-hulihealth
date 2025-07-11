import { describe, it, expect, beforeEach } from 'vitest';
import { createMcpServer, buildHttpServer } from '../src/index.js';
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

  it('exposes tool metadata endpoint', async () => {
    const app = buildHttpServer();
    const res = await app.inject({ method: 'GET', url: '/mcp/tools' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    const names = body.map((t: any) => t.name);
    expect(names.sort()).toEqual(tools.map((t) => t.name).sort());
    await app.close();
  });

  it('returns 400 for invalid SSE session', async () => {
    const app = buildHttpServer();
    const res = await app.inject({
      method: 'POST',
      url: '/mcp?sessionId=missing',
      payload: {},
    });
    expect(res.statusCode).toBe(400);
    await app.close();
  });
});
