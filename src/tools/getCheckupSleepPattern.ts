import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { CheckupSleepPattern } from '../mcp/schema.js';

export const getCheckupSleepPatternSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupSleepPatternParams = z.infer<typeof getCheckupSleepPatternSchema>;

export const getCheckupSleepPattern = {
  name: 'get_checkup_sleep_pattern',
  description: `Retrieves sleep pattern information from a checkup.`,
  parameters: getCheckupSleepPatternSchema,
  async execute(params: GetCheckupSleepPatternParams): Promise<CheckupSleepPattern> {
    return huliClient.getCheckupSleepPattern(params.event_id);
  },
};
export type GetCheckupSleepPatternTool = typeof getCheckupSleepPattern;
export default getCheckupSleepPattern;
