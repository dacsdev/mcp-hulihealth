import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { AppointmentTagsResponse } from '../mcp/schema';

export const listAppointmentTagsSchema = z.object({
  limit: z.number().int().optional(),
  offset: z.number().int().optional(),
});

export type ListAppointmentTagsParams = z.infer<typeof listAppointmentTagsSchema>;

export const listAppointmentTags = {
  name: 'list_appointment_tags',
  description: `Lists booking tags configured for the organization.

**Usage Example:**
\`\`\`json
{
  "limit": 5,
  "offset": 0
}
\`\`\`
`,
  parameters: listAppointmentTagsSchema,
  async execute(params: ListAppointmentTagsParams): Promise<AppointmentTagsResponse> {
    const limit = params.limit ?? 10;
    const offset = params.offset ?? 0;
    return huliClient.listAppointmentTags(limit, offset);
  },
};
export type ListAppointmentTagsTool = typeof listAppointmentTags;
