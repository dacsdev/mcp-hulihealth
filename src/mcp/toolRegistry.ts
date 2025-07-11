import { FastifyInstance } from 'fastify';
import {
  scheduleAppointment,
  ScheduleAppointmentParams,
} from '../tools/scheduleAppointment';
import {
  cancelAppointment,
  CancelAppointmentParams,
} from '../tools/cancelAppointment';
import { Appointment } from './schema';
import { z } from 'zod';

export interface Tool<P, R> {
  name: string;
  description: string;
  parameters: z.ZodType<P>;
  execute: (params: P) => Promise<R>;
}

export const tools: Tool<any, any>[] = [scheduleAppointment, cancelAppointment];

export function registerToolRoutes(app: FastifyInstance): void {
  app.get('/mcp/tools', async () =>
    tools.map((t) => ({
      name: t.name,
      description: t.description,
      schema: (t.parameters as any).toJSON?.() ?? {},
    }))
  );

  app.post<{ Params: { tool: string }; Body: unknown }>('/mcp/tool/execute/:tool', async (req, reply) => {
    const tool = tools.find((t) => t.name === req.params.tool);
    if (!tool) return reply.status(404).send({ error: 'Tool not found' });
    const parsed = tool.parameters.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send(parsed.error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await tool.execute(parsed.data as any);
    return result;
  });
}
