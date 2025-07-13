import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { Patient } from '../mcp/schema.js';

export const getPatientSchema = z.object({
  patient_file_id: z.string(),
});

export type GetPatientParams = z.infer<typeof getPatientSchema>;

export const getPatient = {
  name: 'obtener_paciente',
  description: `Retrieves patient information by patient file ID.`,
  parameters: getPatientSchema,
  async execute(params: GetPatientParams): Promise<Patient> {
    return huliClient.getPatient(params.patient_file_id);
  },
};
export type GetPatientTool = typeof getPatient;
export default getPatient;
