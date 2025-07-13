import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { Appointment } from '../mcp/schema.js';

export const getAppointmentByIdSchema = z.object({
  event_id: z.string(),
});

export type GetAppointmentByIdParams = z.infer<typeof getAppointmentByIdSchema>;

export const getAppointmentById = {
  name: 'get_appointment_by_id',
  description: `Gets appointment details by event ID.

**Usage Example:**
\`\`\`json
{
  "event_id": "743905"
}
\`\`\`
`,
  parameters: getAppointmentByIdSchema,
  async execute(params: GetAppointmentByIdParams): Promise<Appointment> {
    return huliClient.getAppointmentById(params.event_id);
  },
};
export type GetAppointmentByIdTool = typeof getAppointmentById;
export default getAppointmentById;
