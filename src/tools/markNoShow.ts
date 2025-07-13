import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { Appointment } from '../mcp/schema.js';

export const markNoShowSchema = z.object({
  event_id: z.string(),
});

export type MarkNoShowParams = z.infer<typeof markNoShowSchema>;

export const markNoShow = {
  name: 'mark_no_show',
  description: `Marks an appointment as no-show when the patient did not attend.

**Usage Example:**
\`\`\`json
{
  "event_id": "123"
}
\`\`\`
`,
  parameters: markNoShowSchema,
  async execute(params: MarkNoShowParams): Promise<Appointment> {
    return huliClient.markNoShow(params.event_id);
  },
};
export type MarkNoShowTool = typeof markNoShow;
export default markNoShow;
