import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { CheckupBowelHabit } from '../mcp/schema';

export const getCheckupBowelHabitSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupBowelHabitParams = z.infer<typeof getCheckupBowelHabitSchema>;

export const getCheckupBowelHabit = {
  name: 'get_checkup_bowel_habit',
  description: `Retrieves bowel habit information from a checkup.`,
  parameters: getCheckupBowelHabitSchema,
  async execute(params: GetCheckupBowelHabitParams): Promise<CheckupBowelHabit> {
    return huliClient.getCheckupBowelHabit(params.event_id);
  },
};
export type GetCheckupBowelHabitTool = typeof getCheckupBowelHabit;
