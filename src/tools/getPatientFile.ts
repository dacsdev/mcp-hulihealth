import { z } from 'zod';
import { huliClient } from '../services/huliClient.js';
import { PatientFileResponse } from '../mcp/schema.js';

export const getPatientFileSchema = z.object({
  patient_file_id: z.string(),
});

export type GetPatientFileParams = z.infer<typeof getPatientFileSchema>;

export const getPatientFile = {
  name: 'get_patient_file',
  description: `Retrieves a patient file by ID.`,
  parameters: getPatientFileSchema,
  async execute(params: GetPatientFileParams): Promise<PatientFileResponse> {
    return huliClient.getPatientFile(params.patient_file_id);
  },
};
export type GetPatientFileTool = typeof getPatientFile;
export default getPatientFile;
