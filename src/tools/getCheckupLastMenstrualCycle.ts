import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { CheckupLastMenstrualCycle } from '../mcp/schema';

export const getCheckupLastMenstrualCycleSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupLastMenstrualCycleParams = z.infer<typeof getCheckupLastMenstrualCycleSchema>;

export const getCheckupLastMenstrualCycle = {
  name: 'get_checkup_last_menstrual_cycle',
  description: `Retrieves last menstrual cycle information from a checkup.`,
  parameters: getCheckupLastMenstrualCycleSchema,
  async execute(params: GetCheckupLastMenstrualCycleParams): Promise<CheckupLastMenstrualCycle> {
    return huliClient.getCheckupLastMenstrualCycle(params.event_id);
  },
};
export type GetCheckupLastMenstrualCycleTool = typeof getCheckupLastMenstrualCycle;
