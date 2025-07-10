import Fastify from 'fastify';
import dotenv from 'dotenv';
import { registerToolRoutes } from './mcp/toolRegistry';

dotenv.config();

const app = Fastify();

registerToolRoutes(app);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
