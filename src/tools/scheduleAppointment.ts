import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { CreateAppointmentRequest, Appointment } from '../mcp/schema.js';

export const scheduleAppointmentSchema = z.object({
  id_doctor: z.number(),
  id_clinic: z.number(),
  start_date: z.string().regex(/\d{4}-\d{2}-\d{2}/),
  time_from: z.string().regex(/\d{2}:\d{2}:\d{2}/),
  id_patient_file: z.number().optional(),
  source_event: z.number().optional(),
  end_date: z.string().regex(/\d{4}-\d{2}-\d{2}/).optional(),
  time_to: z.string().regex(/\d{2}:\d{2}:\d{2}/).optional(),
  notes: z.string().optional(),
  color: z.string().regex(/^[0-9A-Fa-f]{6}$/).optional(),
  id_treatment: z.number().optional(),
  insurance_name: z.string().optional(),
  insurance_number: z.string().optional(),
  is_first_time_patient: z.boolean().optional(),
  id_tags: z.array(z.number()).optional(),
});

export type ScheduleAppointmentParams = z.infer<typeof scheduleAppointmentSchema>;

export const scheduleAppointment = {
  name: 'agendar_cita',
  description: `Schedules a new appointment in the HuliHealth system.

**Best for:** creating a patient appointment using an availability slot.
**Common mistakes:** attempting to reschedule or cancel (use other tools).
**Usage Example:**
\`\`\`json
{
  "id_doctor": 1,
  "id_clinic": 2292,
  "start_date": "2025-08-01",
  "time_from": "09:00:00",
  "source_event": 516015
}
\`\`\`
`,
  parameters: scheduleAppointmentSchema,
  async execute(params: ScheduleAppointmentParams): Promise<Appointment> {
    const data = params as CreateAppointmentRequest;
    return huliClient.createAppointment(data);
  },
};
export type ScheduleAppointmentTool = typeof scheduleAppointment;
export default scheduleAppointment;
