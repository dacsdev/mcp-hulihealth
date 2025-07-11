#!/usr/bin/env node
import Fastify from 'fastify';
import dotenv from 'dotenv';
import {
  tools,
  registerToolRoutes,
} from './mcp/toolRegistry.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

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
    server.sendLoggingMessage({ level, data });
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
      },
      async (params) => {
        const result = await tool.execute(params as any);
        return { content: [{ type: 'json', json: result }] };
      }
    );
  }
  return server;
}

export function buildHttpServer() {
  const app = Fastify();
  registerToolRoutes(app);

  const sseSessions = new Map<
    string,
    { server: McpServer; transport: SSEServerTransport }
  >();

  app.get('/mcp', async (req, reply) => {
    const server = createMcpServer();
    const transport = new SSEServerTransport('/mcp', reply.raw);
    sseSessions.set(transport.sessionId, { server, transport });
    transport.onclose = () => sseSessions.delete(transport.sessionId);
    await server.connect(transport);
  });

  app.post('/mcp', async (req, reply) => {
    const sessionId = (req.query as any).sessionId as string;
    const session = sseSessions.get(sessionId);
    if (!session) {
      reply.status(400).send({ error: 'Invalid sessionId' });
      return;
    }
    await session.transport.handlePostMessage(req.raw, reply.raw, req.body);
  });

  return app;
}

export async function startStdioServer(): Promise<void> {
  validateEnv();
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  isStdioTransport = true;
  await server.connect(transport);
  safeLog(server, 'info', 'HuliHealth MCP Server running on stdio');
}

export async function startHttpServer(port = PORT): Promise<void> {
  validateEnv();
  const app = buildHttpServer();
  try {
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`HuliHealth MCP listening on http://0.0.0.0:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

if (process.env.SSE_LOCAL === 'true') {
  startHttpServer().catch((err) => {
    console.error('Fatal error running server:', err);
    process.exit(1);
  });
} else {
  startStdioServer().catch((err) => {
    console.error('Fatal error running server:', err);
    process.exit(1);
  });
}
