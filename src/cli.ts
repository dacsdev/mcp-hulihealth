#!/usr/bin/env node
import dotenv from 'dotenv';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { tools } from './mcp/toolRegistry.js';
import { sanitizeInput } from './utils/sanitize.js';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

function handleFatalError(err: Error): void {
  console.error('[MCP Fatal Error]', err.message);
  process.exit(1);
}

function validateEnv(): void {
  const apiKey = sanitizeInput(process.env.HULIHEALTH_API_KEY || '');
  const orgId = sanitizeInput(process.env.HULI_ORG_ID || '');
  if (!apiKey || !orgId) {
    throw new Error('HULIHEALTH_API_KEY and HULI_ORG_ID environment variables must be set');
  }
}

export function createMcpServer(): any {
  const server = new McpServer({ name: 'hulihealth-mcp-dacs', version: '1.0.0' });

  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.parameters,
      },
      async (params: unknown) => {
        try {
          const result = await tool.execute(params as any);
          return { content: [{ type: 'json', json: result }] };
        } catch (error: any) {
          console.error(`[MCP Tool Error] Failed to execute tool '${tool.name}':`, error);
          throw new Error(`Execution failed for tool ${tool.name}: ${error.message}`);
        }
      }
    );
  }
  return server;
}

export async function startStdioServer(): Promise<void> {
  console.error('[MCP Status] Initializing HuliHealth MCP Server in STDIO mode...');
  try {
    validateEnv();
    const server = createMcpServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('[MCP Status] HuliHealth MCP Server connected via STDIO. Ready for requests.');
  } catch (err) {
    handleFatalError(err as Error);
  }
}

export async function startSseServer(port = PORT): Promise<void> {
  console.log(`[MCP Status] Initializing HuliHealth MCP Server in SSE mode on port ${port}...`);
  try {
    validateEnv();
    const { SSEServerTransport } = await import('@modelcontextprotocol/sdk/server/sse.js');
    const sseSessions = new Map<string, { server: any; transport: any }>();

  const httpServer = http.createServer(async (req: any, res: any) => {
    if (req.method === 'GET' && req.url?.startsWith('/mcp')) {
      const server = createMcpServer();
      const transport = new SSEServerTransport('/mcp', res);
      sseSessions.set(transport.sessionId, { server, transport });
      transport.onclose = () => sseSessions.delete(transport.sessionId);
      await server.connect(transport);
      console.log(`[MCP Status] New SSE session created: ${transport.sessionId}`);
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
      console.log(`[MCP Status] HuliHealth MCP SSE server listening on http://0.0.0.0:${port}`);
    });
  } catch (err) {
    handleFatalError(err as Error);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`\nHuliHealth MCP CLI\n\nUsage:\n  npx mcp-hulihealth [options]\n\nOptions:\n  --help, -h    Show this help\n  --sse         Start in SSE (HTTP) server mode (default: stdio)\n\nRequired environment variables:\n  HULIHEALTH_API_KEY   Your HuliHealth API Key\n  HULI_ORG_ID         Your HuliHealth Organization ID\n  PORT                (optional, for SSE mode. Default: 3000)\n`);
    process.exit(0);
  }

  try {
    if (args.includes('--sse') || process.env.PORT) {
      startSseServer();
    } else {
      startStdioServer();
    }
  } catch (err: any) {
    handleFatalError(err);
  }
}


