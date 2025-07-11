import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { Appointment, CancelAppointmentRequest } from '../mcp/schema';

export const cancelAppointmentSchema = z.object({
  event_id: z.string(),
  is_status_modified_by_patient: z.boolean().optional().default(true),
});

export type CancelAppointmentParams = z.infer<typeof cancelAppointmentSchema>;

export const cancelAppointment = {
  name: 'cancelar_cita',
  description: `Cancels an existing appointment in HuliHealth.

**Best for:** when a patient or provider needs to cancel a booked appointment.
**Common mistakes:** using for rescheduling (use the reschedule tool instead).
**Usage Example:**
\`\`\`json
{
  "event_id": "12345",
  "is_status_modified_by_patient": true
}
\`\`\`
`,
  parameters: cancelAppointmentSchema,
  async execute(params: CancelAppointmentParams): Promise<Appointment> {
    const data: CancelAppointmentRequest = {
      is_status_modified_by_patient: params.is_status_modified_by_patient,
    };
    return huliClient.cancelAppointment(params.event_id, data);
  },
};
export type CancelAppointmentTool = typeof cancelAppointment;
