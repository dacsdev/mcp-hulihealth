import Fastify from 'fastify';
import dotenv from 'dotenv';
import { tools, registerToolRoutes } from './mcp/toolRegistry.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

function createMcpServer(): McpServer {
  const server = new McpServer({ name: 'hulihealth-mcp', version: '1.0.0' });
  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.parameters as any,
      },
      async (params) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await tool.execute(params as any);
        return { content: [{ type: 'json', json: result }] };
      }
    );
  }
  return server;
}

// Connect stdio transport for CLI usage
const stdioServer = createMcpServer();
const stdioTransport = new StdioServerTransport();
stdioServer.connect(stdioTransport).catch((err) => {
  console.error('Failed to start stdio transport', err);
});

const app = Fastify();

registerToolRoutes(app);

// SSE support
const sseSessions = new Map<string, { server: McpServer; transport: SSEServerTransport }>();

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

app.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
