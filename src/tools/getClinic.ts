import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { Clinic } from '../mcp/schema.js';

export const getClinicSchema = z.object({
  clinic_id: z.string(),
});

export type GetClinicParams = z.infer<typeof getClinicSchema>;

export const getClinic = {
  name: 'obtener_clinica',
  description: `Retrieves information for a specific clinic by ID.`,
  parameters: getClinicSchema,
  async execute(params: GetClinicParams): Promise<Clinic> {
    return huliClient.getClinic(params.clinic_id);
  },
};
export type GetClinicTool = typeof getClinic;
export default getClinic;
