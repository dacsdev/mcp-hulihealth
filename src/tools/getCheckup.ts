import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { Checkup } from '../mcp/schema';

export const getCheckupSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupParams = z.infer<typeof getCheckupSchema>;

export const getCheckup = {
  name: 'get_checkup',
  description: `Retrieves complete checkup information.`,
  parameters: getCheckupSchema,
  async execute(params: GetCheckupParams): Promise<Checkup> {
    return huliClient.getCheckup(params.event_id);
  },
};
export type GetCheckupTool = typeof getCheckup;
