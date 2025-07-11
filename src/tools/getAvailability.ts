import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { DoctorAvailabilityResponse } from '../mcp/schema';

export const getAvailabilitySchema = z.object({
  doctor_id: z.string(),
  clinic_id: z.string(),
  from: z.string().datetime(),
  to: z.string().datetime(),
});

export type GetAvailabilityParams = z.infer<typeof getAvailabilitySchema>;

export const getAvailability = {
  name: 'consultar_disponibilidad',
  description: `Returns available appointment slots for a doctor at a given clinic.

**Best for:** showing open times when scheduling.
**Usage Example:**
\`\`\`json
{
  "doctor_id": "1",
  "clinic_id": "2292",
  "from": "2025-07-01T00:00:00Z",
  "to": "2025-07-07T00:00:00Z"
}
\`\`\`
`,
  parameters: getAvailabilitySchema,
  async execute(params: GetAvailabilityParams): Promise<DoctorAvailabilityResponse> {
    return huliClient.getAvailability(params.doctor_id, params.clinic_id, params.from, params.to);
  },
};
export type GetAvailabilityTool = typeof getAvailability;
