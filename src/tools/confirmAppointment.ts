import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { Appointment } from '../mcp/schema.js';

export const confirmAppointmentSchema = z.object({
  event_id: z.string(),
});

export type ConfirmAppointmentParams = z.infer<typeof confirmAppointmentSchema>;

export const confirmAppointment = {
  name: 'confirm_appointment',
  description: `Marks an appointment as confirmed by the patient.

**Usage Example:**
\`\`\`json
{
  "event_id": "123"
}
\`\`\`
`,
  parameters: confirmAppointmentSchema,
  async execute(params: ConfirmAppointmentParams): Promise<Appointment> {
    return huliClient.confirmAppointment(params.event_id);
  },
};
export type ConfirmAppointmentTool = typeof confirmAppointment;
export default confirmAppointment;
