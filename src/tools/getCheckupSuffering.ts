import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { CheckupSuffering } from '../mcp/schema.js';

export const getCheckupSufferingSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupSufferingParams = z.infer<typeof getCheckupSufferingSchema>;

export const getCheckupSuffering = {
  name: 'get_checkup_suffering',
  description: `Retrieves patient suffering or symptoms from a checkup.`,
  parameters: getCheckupSufferingSchema,
  async execute(params: GetCheckupSufferingParams): Promise<CheckupSuffering> {
    return huliClient.getCheckupSuffering(params.event_id);
  },
};
export type GetCheckupSufferingTool = typeof getCheckupSuffering;
export default getCheckupSuffering;
