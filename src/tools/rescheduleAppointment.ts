import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import {
  Appointment,
  RescheduleAppointmentRequest,
  AppointmentList,
} from '../mcp/schema.js';

export const rescheduleAppointmentSchema = z
  .object({
    email: z.string().email(),
    event_id: z.string(),
    start_date: z.string().regex(/\d{4}-\d{2}-\d{2}/),
    time_from: z.string().regex(/\d{2}:\d{2}:\d{2}/),
    end_date: z.string().regex(/\d{4}-\d{2}-\d{2}/).optional(),
    time_to: z.string().regex(/\d{2}:\d{2}:\d{2}/).optional(),
    source_event: z.string().optional(),
    is_status_modified_by_patient: z.boolean().optional().default(true),
  })
  .refine((d) => d.start_date && d.time_from, {
    message: 'start_date and time_from are required',
  });

export type RescheduleAppointmentParams = z.infer<typeof rescheduleAppointmentSchema>;

export const rescheduleAppointment = {
  name: 'reagendar_cita',
  description: `Reschedules an existing appointment to a new date and time.

**Best for:** moving a booked appointment to a new slot while keeping patient association.
**Usage Example:**
\`\`\`json
{
  "email": "patient@example.com",
  "event_id": "123",
  "start_date": "2025-08-10",
  "time_from": "10:00:00",
  "source_event": "516015"
}
\`\`\`
`,
  parameters: rescheduleAppointmentSchema,
  async execute(params: RescheduleAppointmentParams): Promise<Appointment> {
    const patients = await huliClient.listPatientFiles(params.email, 1);
    const patient = patients.patientFiles?.[0];
    if (!patient) throw new Error('Patient not found');
    const patientFileId = patient.id;
    const appts: AppointmentList = await huliClient.getAppointmentsByPatient(patientFileId, { limit: 100 });
    const match = appts.appointments.find((a) => String(a.idEvent) === String(params.event_id));
    if (!match) throw new Error('Appointment does not belong to patient');
    const data: RescheduleAppointmentRequest = {
      isStatusModifiedByPatient: params.is_status_modified_by_patient,
      startDate: params.start_date,
      timeFrom: params.time_from,
    };
    if (params.end_date) data.endDate = params.end_date;
    if (params.time_to) data.timeTo = params.time_to;
    if (params.source_event) data.sourceEvent = params.source_event;
    return huliClient.rescheduleAppointment(params.event_id, data);
  },
};
export type RescheduleAppointmentTool = typeof rescheduleAppointment;
export default rescheduleAppointment;
