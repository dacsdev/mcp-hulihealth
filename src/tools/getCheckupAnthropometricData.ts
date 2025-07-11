import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { CheckupAnthropometric } from '../mcp/schema';

export const getCheckupAnthropometricDataSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupAnthropometricDataParams = z.infer<typeof getCheckupAnthropometricDataSchema>;

export const getCheckupAnthropometricData = {
  name: 'get_checkup_anthropometric_data',
  description: `Retrieves anthropometric data from a checkup.`,
  parameters: getCheckupAnthropometricDataSchema,
  async execute(params: GetCheckupAnthropometricDataParams): Promise<CheckupAnthropometric> {
    return huliClient.getCheckupAnthropometricData(params.event_id);
  },
};
export type GetCheckupAnthropometricDataTool = typeof getCheckupAnthropometricData;
