import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { Appointment, UpdateAppointmentRequest } from '../mcp/schema';

export const updateAppointmentSchema = z.object({
  event_id: z.string(),
  data: z.object({
    notes: z.string().optional(),
    color: z.string().regex(/^[0-9A-Fa-f]{6}$/).optional(),
    id_treatment: z.number().optional(),
    insurance_name: z.string().optional(),
    insurance_number: z.string().optional(),
    is_first_time_patient: z.boolean().optional(),
    is_deleted_for_doctor: z.boolean().optional(),
    id_tags: z.array(z.number()).optional(),
  }),
});

export type UpdateAppointmentParams = z.infer<typeof updateAppointmentSchema>;

export const updateAppointment = {
  name: 'update_appointment',
  description: `Updates fields of an existing appointment.

**Usage Example:**
\`\`\`json
{
  "event_id": "123",
  "data": { "notes": "Bring reports" }
}
\`\`\`
`,
  parameters: updateAppointmentSchema,
  async execute(params: UpdateAppointmentParams): Promise<Appointment> {
    const body: UpdateAppointmentRequest = params.data;
    return huliClient.updateAppointment(params.event_id, body);
  },
};
export type UpdateAppointmentTool = typeof updateAppointment;
