import { z } from 'zod';
import { huliClient } from '../services/huliClient';
import { PatientFileRequest, PatientFileResponse } from '../mcp/schema';

export const createPatientFileSchema = z.object({
  data: z.any(),
});

export type CreatePatientFileParams = z.infer<typeof createPatientFileSchema>;

export const createPatientFile = {
  name: 'create_patient_file',
  description: `Creates a new patient file in the Master Patient Index.`,
  parameters: createPatientFileSchema,
  async execute(params: CreatePatientFileParams): Promise<PatientFileResponse> {
    const data: PatientFileRequest = params.data;
    return huliClient.createPatientFile(data);
  },
};
export type CreatePatientFileTool = typeof createPatientFile;
