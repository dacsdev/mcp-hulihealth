import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { AppointmentList } from '../mcp/schema';

export const getAppointmentsSchema = z
  .object({
    doctor_id: z.string().optional(),
    patient_file_id: z.string().optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    limit: z.number().int().optional(),
    offset: z.number().int().optional(),
    status_appointment: z
      .enum(['BOOKED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED', 'NOSHOW'])
      .optional(),
    id_clinic: z.string().optional(),
  })
  .refine((d) => d.doctor_id || d.patient_file_id, {
    message: 'doctor_id or patient_file_id is required',
  });

export type GetAppointmentsParams = z.infer<typeof getAppointmentsSchema>;

export const getAppointments = {
  name: 'obtener_citas',
  description: `Retrieves appointments for a doctor or patient with optional filtering.

**Usage Example:**
\`\`\`json
{
  "doctor_id": "1",
  "from": "2025-07-01T00:00:00Z",
  "to": "2025-07-31T23:59:59Z"
}
\`\`\`
`,
  parameters: getAppointmentsSchema,
  async execute(params: GetAppointmentsParams): Promise<AppointmentList> {
    if (params.doctor_id) {
      return huliClient.getAppointmentsByDoctor(params.doctor_id, {
        from: params.from,
        to: params.to,
        limit: params.limit,
        offset: params.offset,
        status_appointment: params.status_appointment,
        idClinic: params.id_clinic,
      });
    }
    return huliClient.getAppointmentsByPatient(params.patient_file_id!, {
      from: params.from,
      to: params.to,
      limit: params.limit,
      offset: params.offset,
      status_appointment: params.status_appointment,
    });
  },
};
export type GetAppointmentsTool = typeof getAppointments;
