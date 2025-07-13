import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { CheckupNote } from '../mcp/schema.js';

export const getCheckupNoteSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupNoteParams = z.infer<typeof getCheckupNoteSchema>;

export const getCheckupNote = {
  name: 'get_checkup_note',
  description: `Retrieves general notes from a checkup.`,
  parameters: getCheckupNoteSchema,
  async execute(params: GetCheckupNoteParams): Promise<CheckupNote> {
    return huliClient.getCheckupNote(params.event_id);
  },
};
export type GetCheckupNoteTool = typeof getCheckupNote;
export default getCheckupNote;
