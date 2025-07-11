import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { CheckupPhysicalNote } from '../mcp/schema';

export const getCheckupPhysicalNoteSchema = z.object({
  event_id: z.string(),
});

export type GetCheckupPhysicalNoteParams = z.infer<typeof getCheckupPhysicalNoteSchema>;

export const getCheckupPhysicalNote = {
  name: 'get_checkup_physical_note',
  description: `Retrieves physical notes from a checkup.`,
  parameters: getCheckupPhysicalNoteSchema,
  async execute(params: GetCheckupPhysicalNoteParams): Promise<CheckupPhysicalNote> {
    return huliClient.getCheckupPhysicalNote(params.event_id);
  },
};
export type GetCheckupPhysicalNoteTool = typeof getCheckupPhysicalNote;
