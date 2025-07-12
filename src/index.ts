#!/usr/bin/env node
import dotenv from 'dotenv';
import { tools } from './mcp/toolRegistry.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import http from 'node:http';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

function validateEnv(): void {
  if (!process.env.HULIHEALTH_API_KEY || !process.env.HULI_ORG_ID) {
    throw new Error(
      'HULIHEALTH_API_KEY and HULI_ORG_ID environment variables must be set'
    );
  }
}

let isStdioTransport = false;

function safeLog(
  server: McpServer,
  level: 'info' | 'warning' | 'error' | 'debug' | 'notice',
  data: unknown
): void {
  if (isStdioTransport) {
    console.error(
      `[${level}] ${typeof data === 'object' ? JSON.stringify(data) : data}`
    );
  } else {
    // Forward logs to the underlying server when not using stdio
    void server.server.sendLoggingMessage({ level, data });
  }
}

export function createMcpServer(): McpServer {
  const server = new McpServer({ name: 'hulihealth-mcp', version: '1.0.0' });
  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.parameters as any,
      } as any,
      async (params: unknown) => {
        const result = await tool.execute(params as any);
        return { content: [{ type: 'json', json: result }] } as any;
      }
    );
  }
  return server;
}


export async function startStdioServer(): Promise<void> {
  validateEnv();
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  isStdioTransport = true;
  await server.connect(transport);
  safeLog(server, 'info', 'HuliHealth MCP Server running on stdio');
}

export async function startSseServer(port = PORT): Promise<void> {
  validateEnv();
  const sseSessions = new Map<
    string,
    { server: McpServer; transport: SSEServerTransport }
  >();

  const httpServer = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/mcp') {
      const server = createMcpServer();
      const transport = new SSEServerTransport('/mcp', res);
      sseSessions.set(transport.sessionId, { server, transport });
      transport.onclose = () => sseSessions.delete(transport.sessionId);
      await server.connect(transport);
    } else if (req.method === 'POST' && req.url?.startsWith('/mcp')) {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const sessionId = url.searchParams.get('sessionId');
      const session = sessionId ? sseSessions.get(sessionId) : undefined;
      if (!session) {
        res.statusCode = 400;
        res.end('Invalid sessionId');
        return;
      }
      await session.transport.handlePostMessage(req, res);
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`HuliHealth MCP SSE server listening on http://0.0.0.0:${port}`);
  });
}

if (require.main === module) {
  if (process.env.SSE_LOCAL === 'true') {
    startSseServer().catch((err) => {
      console.error('Fatal error running server:', err);
      process.exit(1);
    });
  } else {
    startStdioServer().catch((err) => {
      console.error('Fatal error running server:', err);
      process.exit(1);
    });
  }
}
