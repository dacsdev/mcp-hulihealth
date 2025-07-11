import { z } from 'zod';
import { huliClient } from '../services/huliClient';

export const getMostUsedAppointmentColorsSchema = z
  .object({
    doctor_id: z.string().optional(),
    clinic_id: z.string().optional(),
    patient_file_id: z.string().optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    status_appointment: z
      .enum(['BOOKED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED', 'NOSHOW'])
      .optional(),
    limit: z.number().int().optional().default(1000),
  })
  .refine((d) => d.doctor_id || d.patient_file_id, {
    message: 'doctor_id or patient_file_id is required',
  });

export type GetMostUsedAppointmentColorsParams = z.infer<typeof getMostUsedAppointmentColorsSchema>;

export const getMostUsedAppointmentColors = {
  name: 'get_most_used_appointment_colors',
  description: `Returns the most common appointment colors with counts.

**Usage Example:**
\`\`\`json
{
  "doctor_id": "1",
  "limit": 50
}
\`\`\`
`,
  parameters: getMostUsedAppointmentColorsSchema,
  async execute(params: GetMostUsedAppointmentColorsParams): Promise<{ color_ranking: any[]; total_appointments: number }> {
    const opts = {
      from: params.from,
      to: params.to,
      limit: params.limit,
      status_appointment: params.status_appointment,
      idClinic: params.clinic_id,
    } as any;
    let list;
    if (params.doctor_id) {
      list = await huliClient.getAppointmentsByDoctor(params.doctor_id, opts);
    } else {
      list = await huliClient.getAppointmentsByPatient(params.patient_file_id!, opts);
    }
    const colorInfo: Record<string, { count: number; types: Set<string> }> = {};
    for (const appt of list.appointments) {
      const color = (appt as any).color as string | undefined;
      const type = (appt as any).type || appt.statusAppointment;
      if (color) {
        if (!colorInfo[color]) colorInfo[color] = { count: 0, types: new Set() };
        colorInfo[color].count += 1;
        if (type) colorInfo[color].types.add(String(type));
      }
    }
    const ranking = Object.entries(colorInfo)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([color, info]) => ({ color, count: info.count, types: Array.from(info.types) }));
    return { color_ranking: ranking, total_appointments: list.appointments.length };
  },
};
export type GetMostUsedAppointmentColorsTool = typeof getMostUsedAppointmentColors;
