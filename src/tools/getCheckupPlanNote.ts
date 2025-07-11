import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { CheckupPlanNote } from '../mcp/schema';

export const getCheckupPlanNoteSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupPlanNoteParams = z.infer<typeof getCheckupPlanNoteSchema>;

export const getCheckupPlanNote = {
  name: 'get_checkup_plan_note',
  description: `Retrieves treatment plan notes from a checkup.`,
  parameters: getCheckupPlanNoteSchema,
  async execute(params: GetCheckupPlanNoteParams): Promise<CheckupPlanNote> {
    return huliClient.getCheckupPlanNote(params.event_id);
  },
};
export type GetCheckupPlanNoteTool = typeof getCheckupPlanNote;
