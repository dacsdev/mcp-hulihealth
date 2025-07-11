import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { CheckupVitalSigns } from '../mcp/schema';

export const getCheckupVitalSignsSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupVitalSignsParams = z.infer<typeof getCheckupVitalSignsSchema>;

export const getCheckupVitalSigns = {
  name: 'get_checkup_vital_signs',
  description: `Retrieves vital signs recorded during a checkup.`,
  parameters: getCheckupVitalSignsSchema,
  async execute(params: GetCheckupVitalSignsParams): Promise<CheckupVitalSigns> {
    return huliClient.getCheckupVitalSigns(params.event_id);
  },
};
export type GetCheckupVitalSignsTool = typeof getCheckupVitalSigns;
